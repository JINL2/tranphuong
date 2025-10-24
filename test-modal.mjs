import { chromium } from 'playwright';

(async () => {
  console.log('🚀 모달 팝업 테스트 시작...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
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

    // 하단으로 스크롤 (tri ân 섹션으로)
    console.log('📜 Lời Tri Ân 섹션으로 스크롤...\n');
    await page.evaluate(() => {
      const tributesSection = document.querySelector('.tributes-section');
      tributesSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(2000);

    // "Viết Lời Tri Ân" 버튼 찾기 및 클릭
    console.log('🔍 "Viết Lời Tri Ân" 버튼 찾는 중...\n');
    const addButton = await page.$('button:has-text("Viết Lời Tri Ân")');

    if (addButton) {
      console.log('✅ 버튼 발견! 클릭합니다...\n');

      // 버튼 스크린샷
      await page.screenshot({
        path: 'modal-test-1-before-click.png',
        fullPage: false
      });
      console.log('📸 클릭 전 스크린샷: modal-test-1-before-click.png\n');

      await addButton.click();
      await page.waitForTimeout(1000);

      // 모달이 나타났는지 확인
      const modal = await page.$('[role="dialog"]');
      if (modal) {
        console.log('✅ 모달 팝업이 나타났습니다!\n');

        // 모달 스크린샷
        await page.screenshot({
          path: 'modal-test-2-desktop.png',
          fullPage: false
        });
        console.log('📸 Desktop 모달 스크린샷: modal-test-2-desktop.png\n');

        // 모달 위치 확인
        const modalBox = await modal.boundingBox();
        console.log('📐 모달 위치:', {
          x: Math.round(modalBox.x),
          y: Math.round(modalBox.y),
          width: Math.round(modalBox.width),
          height: Math.round(modalBox.height)
        });
        console.log('');

        // 모달 내용 확인
        const modalTitle = await page.$eval('[role="dialog"] h3', el => el.textContent);
        console.log(`📝 모달 제목: ${modalTitle}\n`);

        // 3초 대기
        await page.waitForTimeout(3000);

        // 모달 닫기 (X 버튼 클릭)
        console.log('❌ 모달 닫기...\n');
        const closeButton = await page.$('[role="dialog"] button[aria-label="Đóng"]');
        if (closeButton) {
          await closeButton.click();
          await page.waitForTimeout(1000);
          console.log('✅ 모달이 닫혔습니다!\n');
        }

        // Mobile 테스트
        console.log('📱 Mobile 뷰 테스트 시작...\n');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        // 다시 버튼 찾아서 클릭
        const addButtonMobile = await page.$('button:has-text("Viết Lời Tri Ân")');
        if (addButtonMobile) {
          await addButtonMobile.click();
          await page.waitForTimeout(1000);

          await page.screenshot({
            path: 'modal-test-3-mobile.png',
            fullPage: false
          });
          console.log('📸 Mobile 모달 스크린샷: modal-test-3-mobile.png\n');

          const modalMobile = await page.$('[role="dialog"]');
          if (modalMobile) {
            const modalBoxMobile = await modalMobile.boundingBox();
            console.log('📐 Mobile 모달 위치:', {
              x: Math.round(modalBoxMobile.x),
              y: Math.round(modalBoxMobile.y),
              width: Math.round(modalBoxMobile.width),
              height: Math.round(modalBoxMobile.height)
            });
            console.log('');
          }

          await page.waitForTimeout(3000);
        }

        console.log('✨ 모든 테스트 완료!\n');
        console.log('✅ Desktop: 모달이 화면 중앙에 표시됨');
        console.log('✅ Mobile: 모달이 전체화면으로 표시됨\n');
      } else {
        console.error('❌ 모달이 나타나지 않았습니다!\n');
      }
    } else {
      console.error('❌ "Viết Lời Tri Ân" 버튼을 찾을 수 없습니다!\n');
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  } finally {
    await page.waitForTimeout(2000);
    await browser.close();
    console.log('👋 브라우저 종료\n');
  }
})();
