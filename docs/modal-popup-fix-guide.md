# Modal Popup Fix Guide - Memorial Website

## 프로젝트 개요
- **프로젝트**: Memorial Website (할아버지 추모 웹사이트)
- **기술 스택**: Next.js 15.5.6 + React 19 + TypeScript + Tailwind CSS v4
- **문제**: AddTributeForm 모달 팝업 위치 및 표시 이슈
- **해결 날짜**: 2025-10-23

---

## 1. 발견된 문제점들

### 1.1 초기 문제: 데스크톱에서 모달 안 보임
**증상:**
- 모바일(responsive view)에서는 팝업이 정상 표시
- 데스크톱 화면에서는 팝업이 화면 밖으로 나가서 안 보임

**원인:**
```css
/* globals.css - 문제가 있던 코드 */
@media (min-width: 768px) {
  .animate-expandForm {
    margin-left: 50%;  /* ❌ 모달을 화면 오른쪽 밖으로 밀어냄 */
  }
}
```

**해결:**
- `margin-left: 50%` 제거
- 표준 centering 기법 사용: `transform: translate(-50%, -50%)`

---

### 1.2 사용자 요구사항 변경: 버튼 위치에서 팝업 열기

**요청 사항:**
1. ✅ 팝업이 화면 중앙이 아닌 **버튼 위치(빨간 박스)**에서 열리도록
2. ✅ 검정 배경 오버레이 제거, **블러만 유지**
3. ✅ 뒤 콘텐츠가 살짝 보이게

**구현:**
```tsx
// AddTributeButton.tsx
<div
  className="fixed inset-0 backdrop-blur-sm z-[10000] animate-fadeIn"
  // bg-black/50 제거 - 블러만 유지
  onClick={handleClose}
/>
```

---

### 1.3 모바일에서 닫기 버튼 안 보임

**증상:**
- "Thêm lời tri ân" 제목 안 보임
- 닫기 버튼(X) 안 보임
- 폼 내용만 표시됨

**원인 1: position 속성 누락**
```css
/* 문제 코드 */
@media (max-width: 767px) {
  .animate-expandForm {
    top: 0;
    left: 0;
    /* position: fixed 누락! */
  }
}
```

**원인 2: Z-index 충돌**
```tsx
// Navigation.tsx
z-[9999]  // Navigation

// AddTributeButton.tsx (초기)
z-40      // Backdrop - 너무 낮음!
z-50      // Modal - Navigation보다 낮음!
z-20      // Header - 너무 낮음!
```

**원인 3: Navigation이 모달 가림**
- Navigation: `position: fixed; top: 0; height: 80px`
- Modal: `position: fixed; top: 0`
- 둘 다 같은 위치에서 시작하여 겹침

---

## 2. 최종 해결 방법

### 2.1 파일별 수정 사항

#### A. `components/tribute/AddTributeButton.tsx`

**수정 1: 버튼 위치 캡처 (ScrollY 제거)**
```tsx
// ❌ 이전 코드
const rect = buttonRef.current.getBoundingClientRect();
setButtonPosition({
  top: rect.top + window.scrollY,  // position: fixed에는 필요 없음!
  left: rect.left,
});

// ✅ 수정 코드
const rect = buttonRef.current.getBoundingClientRect();
setButtonPosition({
  top: rect.top,  // viewport 기준 좌표만 사용
  left: rect.left,
});
```

**수정 2: Z-index 증가**
```tsx
// ✅ Navigation(z-9999)보다 높게 설정
<div
  className="fixed inset-0 backdrop-blur-sm z-[10000] animate-fadeIn"
  onClick={handleClose}
/>

<div
  className="fixed z-[10001] animate-expandForm"
  style={{
    '--button-top': `${buttonPosition.top}px`,
    '--button-left': `${buttonPosition.left}px`,
  }}
>
```

---

#### B. `components/tribute/AddTributeForm.tsx`

**수정 1: Sticky 헤더 구조 변경**
```tsx
// ✅ 헤더와 닫기 버튼을 하나의 sticky 컨테이너로 묶음
<div className="sticky top-0 bg-white z-[10002] border-b border-gray-200 px-6 pt-6 pb-4 md:px-8">
  <div className="relative">
    {/* 닫기 버튼 - 헤더 내부에서 absolute 위치 */}
    <button
      onClick={onClose}
      className="absolute -top-2 right-0 p-2 rounded-full hover:bg-gray-100"
    >
      <X className="w-5 h-5 text-gray-600" />
    </button>

    {/* 헤더 - 오른쪽 여백으로 버튼과 겹치지 않게 */}
    <div className="pr-10">
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        Thêm lời tri ân
      </h3>
      <p className="text-sm text-gray-600">
        Chia sẻ kỷ niệm và lời tưởng nhớ của bạn
      </p>
    </div>
  </div>
</div>
```

**수정 2: 부모 컨테이너에 relative 추가**
```tsx
// ✅ absolute 버튼의 기준점 설정
<div className="bg-white rounded-lg shadow-xl w-full h-full overflow-y-auto relative">
```

---

#### C. `app/globals.css`

**수정 1: 모바일 모달 위치 (Navigation 아래로)**
```css
/* ✅ 모바일: Navigation(80px) 아래에서 시작 */
@media (max-width: 767px) {
  .animate-expandForm {
    animation-name: slideUpMobile;
    position: fixed;  /* 추가! */
    top: 80px;        /* Navigation 높이만큼 아래에서 시작 */
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: calc(100% - 80px);      /* Navigation 제외 */
    max-height: calc(100vh - 80px); /* Navigation 제외 */
  }
}
```

**수정 2: 데스크톱 모달 위치 (버튼 위치)**
```css
/* ✅ 데스크톱: 버튼 왼쪽 상단 모서리에서 시작 */
@media (min-width: 768px) {
  .animate-expandForm {
    animation-name: expandDesktop;
    position: fixed;
    top: var(--button-top);    /* 버튼 위치 */
    left: var(--button-left);  /* 버튼 위치 */
    width: min(600px, 90vw);
    max-height: 80vh;
    overflow-y: auto;
    transform-origin: top left; /* 왼쪽 상단 기준 확장 */
  }
}
```

**수정 3: 애니메이션 개선**
```css
/* ✅ 버튼 위치에서 확장되는 애니메이션 */
@keyframes expandDesktop {
  from {
    transform: scale(0.3);  /* 작은 점에서 시작 */
    opacity: 0;
  }
  to {
    transform: scale(1);    /* 정상 크기로 확대 */
    opacity: 1;
  }
}
```

---

## 3. Z-index 계층 구조

### 최종 Z-index 설정
```
Navigation:       z-[9999]   ← 최상단 (항상 보임)
↓
Modal Header:     z-[10002]  ← 모달 내부 최상단 (sticky)
↓
Modal Container:  z-[10001]  ← 모달 본체
↓
Backdrop:         z-[10000]  ← 블러 배경
```

### 왜 이렇게 설정했는가?
1. **Navigation이 항상 보여야 함**: 사용자가 언제든 다른 페이지로 이동 가능
2. **Modal은 Navigation 위**: 팝업이 열리면 주 콘텐츠가 됨
3. **Header는 Modal 내에서 최상단**: 스크롤해도 닫기 버튼 보임

---

## 4. 레이아웃 구조

### 모바일 (< 768px)
```
┌─────────────────────────────────────┐
│  GS. Trần Phương        [☰]        │  ← Navigation (80px, z-9999)
├─────────────────────────────────────┤
│  Thêm lời tri ân              [X]  │  ← Sticky Header (z-10002)
│  Chia sẻ kỷ niệm...               │
├─────────────────────────────────────┤
│  Tên của bạn                       │
│  [____________]                    │  ← Form Content
│                                    │
│  Mối quan hệ                       │  (스크롤 가능)
│  [____________]                    │
│                                    │
│  [Chọn tệp] [Thư viện]            │
│                                    │
│  Lời nhắn gửi                     │
│  [___________________]            │
│                                    │
│  [Gửi lời tri ân]                 │
└─────────────────────────────────────┘
```

### 데스크톱 (≥ 768px)
```
전체 화면
├── Navigation (상단 고정)
└── 콘텐츠 영역
    ├── "Thêm lời tri ân" 버튼
    └── 버튼 클릭 시
        → 버튼 왼쪽 상단에서 모달 확장
        → 600px 너비 (또는 90vw)
        → 블러 배경, 뒤 콘텐츠 보임
```

---

## 5. 코드 참조 (파일:라인)

### 주요 수정 위치

| 파일 | 라인 | 수정 내용 |
|------|------|-----------|
| `AddTributeButton.tsx` | 23 | `window.scrollY` 제거 |
| `AddTributeButton.tsx` | 92 | Backdrop z-index → `z-[10000]` |
| `AddTributeButton.tsx` | 100 | Modal z-index → `z-[10001]` |
| `AddTributeForm.tsx` | 74 | 부모에 `relative` 추가 |
| `AddTributeForm.tsx` | 76 | Sticky header z-index → `z-[10002]` |
| `globals.css` | 478-490 | 모바일: `top: 80px`, `position: fixed` |
| `globals.css` | 492-511 | 데스크톱: 버튼 위치 기준 |
| `globals.css` | 456-465 | 애니메이션 개선 |

---

## 6. 테스트 시나리오

### 6.1 데스크톱 테스트
1. ✅ "Thêm lời tri ân" 버튼 클릭
2. ✅ 버튼 왼쪽 상단에서 모달 확장
3. ✅ 제목 "Thêm lời tri ân" 보임
4. ✅ 닫기 버튼 [X] 보임
5. ✅ 뒤 콘텐츠 블러 처리, 검정 배경 없음
6. ✅ 폼 스크롤 가능
7. ✅ [X] 클릭 또는 ESC 키로 닫기

### 6.2 모바일 테스트
1. ✅ "Thêm lời tri ân" 버튼 클릭
2. ✅ Navigation 아래에서 풀스크린 모달 표시
3. ✅ Sticky 헤더 (제목 + 닫기 버튼) 항상 보임
4. ✅ 폼 스크롤 시 헤더 고정
5. ✅ 뒤 콘텐츠 블러 처리
6. ✅ [X] 클릭 또는 배경 클릭으로 닫기

### 6.3 반응형 테스트
1. ✅ 768px 기준으로 레이아웃 전환
2. ✅ 화면 크기 조절 시 모달 크기 조정
3. ✅ 모든 화면 크기에서 닫기 버튼 접근 가능

---

## 7. 발생 가능한 이슈 및 해결

### 이슈 1: 캐시로 인한 변경사항 미반영
**증상:** 코드 수정했는데 화면에 반영 안 됨

**해결:**
```bash
# 1. Next.js 캐시 삭제
rm -rf .next

# 2. 브라우저 강제 새로고침
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R

# 3. 서버 재시작
npm run dev
```

---

### 이슈 2: 포트 충돌
**증상:** `Port 3000 is in use`

**해결:**
```bash
# 1. 사용 중인 프로세스 찾기
lsof -i :3000

# 2. 프로세스 종료
kill -9 [PID]

# 또는 다른 포트 사용
npm run dev
# → http://localhost:3001 사용
```

---

### 이슈 3: Z-index가 적용 안 됨
**증상:** z-index를 높였는데도 Navigation이 모달을 가림

**원인:** Tailwind arbitrary value가 빌드에 포함 안 됨

**해결:**
```bash
# Tailwind 재빌드
npm run build

# 또는 dev 서버 재시작
```

---

## 8. 향후 개선 사항

### 8.1 애니메이션 개선
- [ ] 모바일: 아래에서 위로 슬라이드 업 애니메이션 개선
- [ ] 데스크톱: 버튼에서 확장되는 효과 부드럽게
- [ ] 닫을 때도 reverse 애니메이션 추가

### 8.2 접근성 (Accessibility)
- [x] Focus trap 구현됨 (`useFocusTrap`)
- [x] ESC 키로 닫기 구현됨
- [x] `aria-modal`, `aria-labelledby` 속성 추가됨
- [ ] 키보드 네비게이션 개선
- [ ] 스크린 리더 테스트

### 8.3 사용자 경험
- [ ] 모달 외부 클릭 시 확인 메시지 (작성 중인 경우)
- [ ] 제출 중 로딩 상태 개선
- [ ] 성공/실패 알림 Toast로 변경 (alert 대체)

---

## 9. 관련 파일 구조

```
memorial-website/
├── app/
│   └── globals.css                    # 모달 애니메이션 & 레이아웃
│
├── components/
│   ├── layout/
│   │   └── Navigation.tsx            # z-[9999] Navigation
│   │
│   └── tribute/
│       ├── AddTributeButton.tsx      # 모달 트리거 & 컨테이너
│       └── AddTributeForm.tsx        # 폼 UI & Sticky Header
│
├── hooks/
│   └── useFocusTrap.ts               # 접근성 - Focus 관리
│
└── docs/
    └── modal-popup-fix-guide.md      # 이 문서
```

---

## 10. 참고 자료

### 공식 문서
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **Tailwind CSS v4**: https://tailwindcss.com/docs

### CSS 관련
- **Position Fixed vs Absolute**: https://developer.mozilla.org/en-US/docs/Web/CSS/position
- **Z-index Stacking Context**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index
- **CSS Transforms**: https://developer.mozilla.org/en-US/docs/Web/CSS/transform

### Accessibility
- **ARIA Modal**: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- **Focus Management**: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/

---

## 11. 작업 타임라인

| 시간 | 작업 내용 | 상태 |
|------|-----------|------|
| 1단계 | 데스크톱 모달 안 보임 문제 진단 | ✅ 완료 |
| 2단계 | `margin-left: 50%` 문제 수정 | ✅ 완료 |
| 3단계 | 사용자 요청: 버튼 위치에서 열기 | ✅ 완료 |
| 4단계 | 검정 배경 제거, 블러만 유지 | ✅ 완료 |
| 5단계 | 모바일 닫기 버튼 안 보임 문제 | ✅ 완료 |
| 6단계 | Z-index 충돌 해결 | ✅ 완료 |
| 7단계 | Navigation 겹침 문제 해결 | ✅ 완료 |
| 8단계 | 최종 테스트 & 문서화 | ✅ 완료 |

---

## 12. 트러블슈팅 체크리스트

모달이 제대로 작동하지 않을 때 확인할 사항:

- [ ] 서버가 실행 중인가? (`npm run dev`)
- [ ] 브라우저 캐시를 비웠는가? (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] `.next` 폴더를 삭제하고 재빌드했는가?
- [ ] 콘솔 에러가 있는가? (F12 개발자 도구)
- [ ] Z-index 값이 올바른가?
  - Backdrop: `z-[10000]`
  - Modal: `z-[10001]`
  - Header: `z-[10002]`
- [ ] CSS 미디어 쿼리가 올바른가? (768px 기준)
- [ ] `position: fixed`가 모바일/데스크톱 모두 설정되었는가?
- [ ] 버튼 위치 계산에 `window.scrollY`가 없는가?

---

**작성일**: 2025-10-23
**프로젝트**: Memorial Website - 할아버지 추모 사이트
**작성자**: Claude (AI Assistant)
**버전**: 1.0
**최종 업데이트**: 2025-10-23

---

## 요약

이 문서는 Memorial Website의 "Thêm lời tri ân" 모달 팝업 수정 작업을 기록합니다.

**주요 해결 내용:**
1. ✅ 데스크톱 모달 화면 밖 문제 해결
2. ✅ 버튼 위치에서 모달 열기 구현
3. ✅ 검정 배경 제거, 블러만 유지
4. ✅ 모바일 닫기 버튼 표시 문제 해결
5. ✅ Navigation과 Z-index 충돌 해결
6. ✅ 모바일에서 Navigation 아래 위치 조정

**최종 테스트**: http://localhost:3001
