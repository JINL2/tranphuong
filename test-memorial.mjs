import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Memorial Website Playwright 테스트 시작...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  console.log('📱 페이지 로딩 중: http://localhost:3000\n');

  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    console.log('✅ 페이지 로드 완료!\n');

    const title = await page.title();
    console.log(`📄 페이지 제목: ${title}\n`);

    // 메인 헤딩 확인
    const heading = await page.textContent('h1');
    console.log(`🎯 메인 헤딩: ${heading}\n`);

    // 날짜 확인
    const dates = await page.textContent('.hero-dates');
    console.log(`📅 생년월일: ${dates}\n`);

    // 역할 확인
    const roles = await page.textContent('.hero-roles');
    console.log(`👤 역할: ${roles}\n`);

    // 스크린샷 캡처
    await page.screenshot({
      path: 'memorial-website-final.png',
      fullPage: true
    });
    console.log('📸 전체 스크린샷 저장: memorial-website-final.png\n');

    // 네비게이션 링크 확인
    const navLinks = await page.$$eval('nav a', links =>
      links.map(link => ({ text: link.textContent, href: link.getAttribute('href') }))
    );
    console.log('🔗 네비게이션 링크:');
    navLinks.forEach((link, i) => {
      console.log(`   ${i + 1}. ${link.text} → ${link.href}`);
    });
    console.log('');

    // 스크롤 테스트
    console.log('📜 페이지 스크롤 테스트...\n');
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1500);

    await page.evaluate(() => window.scrollTo(0, 1600));
    await page.waitForTimeout(1500);

    await page.evaluate(() => window.scrollTo(0, 2400));
    await page.waitForTimeout(1500);

    // 책 섹션 확인
    const booksHeading = await page.$('text=Sách');
    if (booksHeading) {
      console.log('✅ "Sách" (책) 섹션 발견!\n');
      const bookTitles = await page.$$eval('.book-title', titles =>
        titles.map(t => t.textContent)
      );
      console.log(`📚 책 목록 (${bookTitles.length}권):`);
      bookTitles.forEach((title, i) => {
        console.log(`   ${i + 1}. ${title}`);
      });
      console.log('');
    }

    // 타임라인 섹션 확인
    const timelineHeading = await page.$('text=Hành Trình Cuộc Đời');
    if (timelineHeading) {
      console.log('✅ "Hành Trình Cuộc Đời" (인생 여정) 타임라인 발견!\n');
    }

    // 상단으로 스크롤
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    console.log('✨ 모든 테스트 완료! 5초 후 브라우저를 닫습니다...\n');
    await page.waitForTimeout(5000);

    console.log('🎉 Memorial Website가 정상적으로 작동합니다!\n');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  } finally {
    await browser.close();
    console.log('👋 브라우저 종료\n');
  }
})();
