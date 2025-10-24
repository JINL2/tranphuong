import { chromium } from 'playwright';

(async () => {
  console.log('🚀 아파치 웹사이트 Playwright 테스트 시작...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  console.log('📱 페이지 로딩 중: http://localhost/contents_helper_website/\n');

  try {
    await page.goto('http://localhost/contents_helper_website/', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('✅ 페이지 로드 완료!\n');

    const title = await page.title();
    console.log(`📄 페이지 제목: ${title}\n`);

    // 앱 제목 확인
    const appTitle = await page.textContent('.app-title');
    console.log(`🎯 앱 제목: ${appTitle}\n`);

    // 스크린샷 캡처
    await page.screenshot({
      path: 'contents-helper-screenshot.png',
      fullPage: true
    });
    console.log('📸 스크린샷 저장: contents-helper-screenshot.png\n');

    // 버튼 확인
    const buttons = await page.$$eval('button', btns =>
      btns.slice(0, 5).map(btn => btn.textContent?.trim())
    );
    console.log('🔘 버튼들:');
    buttons.forEach((btn, i) => {
      console.log(`   ${i + 1}. ${btn}`);
    });
    console.log('');

    // 스크롤 테스트
    console.log('📜 페이지 스크롤 중...\n');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);

    console.log('✨ 테스트 완료! 5초 후 브라우저를 닫습니다...\n');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  } finally {
    await browser.close();
    console.log('👋 브라우저 종료\n');
  }
})();
