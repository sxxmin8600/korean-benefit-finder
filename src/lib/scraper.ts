import puppeteer from 'puppeteer';
import Parser from 'rss-parser';

export interface ScrapedBenefit {
  title: string;
  content: string;
  url: string;
  agency: string;
  publishedDate: string;
  source: string;
}

// RSS 파서 초기화
const parser = new Parser();

// 정부 기관 RSS 피드 목록
const RSS_FEEDS = [
  {
    url: 'https://www.moel.go.kr/rss/all.xml',
    agency: '고용노동부',
    name: 'moel'
  },
  {
    url: 'https://www.kosaf.go.kr/ko/common/board/rss.do?boardId=BRD_000000000000070',
    agency: '한국장학재단',
    name: 'kosaf'
  },
  {
    url: 'https://www.mafra.go.kr/rss/policyNews.xml',
    agency: '농림축산식품부', 
    name: 'mafra'
  }
];

// 크롤링 대상 사이트
const SCRAPING_TARGETS = [
  {
    url: 'https://www.gov.kr/portal/ntnadmNews/1674758',
    agency: '정부24',
    selector: '.board_list .list_item',
    name: 'gov'
  }
];

/**
 * RSS 피드에서 최신 뉴스 가져오기
 */
export async function scrapeRSSFeeds(): Promise<ScrapedBenefit[]> {
  const results: ScrapedBenefit[] = [];
  
  for (const feed of RSS_FEEDS) {
    try {
      console.log(`RSS 피드 수집 중: ${feed.agency}`);
      const parsed = await parser.parseURL(feed.url);
      
      // 최근 7일간의 항목만 가져오기
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      for (const item of parsed.items.slice(0, 10)) { // 최대 10개
        const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();
        
        if (publishedDate >= weekAgo) {
          results.push({
            title: item.title || '',
            content: item.contentSnippet || item.content || '',
            url: item.link || '',
            agency: feed.agency,
            publishedDate: publishedDate.toISOString(),
            source: `rss_${feed.name}`
          });
        }
      }
    } catch (error) {
      console.error(`RSS 피드 오류 (${feed.agency}):`, error);
    }
  }
  
  return results;
}

/**
 * 웹 크롤링으로 최신 공지사항 가져오기
 */
export async function scrapeWebsites(): Promise<ScrapedBenefit[]> {
  const results: ScrapedBenefit[] = [];
  let browser;
  
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    for (const target of SCRAPING_TARGETS) {
      try {
        console.log(`웹 크롤링 중: ${target.agency}`);
        const page = await browser.newPage();
        await page.goto(target.url, { waitUntil: 'networkidle2' });
        
        // 공지사항 목록 추출
        const items = await page.evaluate((selector) => {
          const elements = document.querySelectorAll(selector);
          return Array.from(elements).slice(0, 10).map(el => {
            const titleEl = el.querySelector('a') || el.querySelector('.title');
            const dateEl = el.querySelector('.date') || el.querySelector('.reg_date');
            
            return {
              title: titleEl?.textContent?.trim() || '',
              url: titleEl?.getAttribute('href') || '',
              date: dateEl?.textContent?.trim() || ''
            };
          });
        }, target.selector);
        
        // 각 항목의 상세 내용 가져오기
        for (const item of items) {
          if (item.title && item.url) {
            try {
              const detailPage = await browser.newPage();
              const fullUrl = item.url.startsWith('http') ? item.url : `${new URL(target.url).origin}${item.url}`;
              await detailPage.goto(fullUrl, { waitUntil: 'networkidle2' });
              
              const content = await detailPage.evaluate(() => {
                const contentEl = document.querySelector('.view_content') || 
                                document.querySelector('.content') ||
                                document.querySelector('.board_view');
                return contentEl?.textContent?.trim() || '';
              });
              
              results.push({
                title: item.title,
                content: content.substring(0, 1000), // 첫 1000자만
                url: fullUrl,
                agency: target.agency,
                publishedDate: new Date().toISOString(),
                source: `web_${target.name}`
              });
              
              await detailPage.close();
            } catch (detailError) {
              console.error('상세 페이지 크롤링 오류:', detailError);
            }
          }
        }
        
        await page.close();
      } catch (error) {
        console.error(`웹 크롤링 오류 (${target.agency}):`, error);
      }
    }
  } catch (error) {
    console.error('브라우저 초기화 오류:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return results;
}

/**
 * 모든 소스에서 데이터 수집
 */
export async function scrapeAllSources(): Promise<ScrapedBenefit[]> {
  console.log('📡 실시간 혜택 업데이트 시작...');
  
  const [rssResults, webResults] = await Promise.all([
    scrapeRSSFeeds(),
    scrapeWebsites()
  ]);
  
  const allResults = [...rssResults, ...webResults];
  console.log(`📊 총 ${allResults.length}개의 새로운 항목을 수집했습니다.`);
  
  return allResults;
}