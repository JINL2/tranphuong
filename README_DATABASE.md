# Memorial Website - Database Integration Summary

## 📌 프로젝트 상태

**현재 진행 상황**: UI와 Supabase Database 연동 완료 (환경 변수 설정만 남음)

**서버 상태**: ✅ 실행 중 (http://localhost:3001)

---

## ✅ 완료된 작업

### 1. Backend Infrastructure
- ✅ **Supabase 클라이언트 설정**
  - `lib/supabase/client.ts` - 브라우저용
  - `lib/supabase/server.ts` - 서버용 (Admin)

- ✅ **이미지 업로드 유틸리티**
  - `lib/utils/uploadImage.ts`
  - 파일 타입 검증 (JPG, PNG, GIF, WEBP)
  - 파일 크기 제한 (5MB)
  - Storage Bucket: `tranphuong`

- ✅ **API Routes**
  - `app/api/tributes/route.ts`
  - POST: 방명록 생성
  - GET: 방명록 목록 조회 (pagination)

### 2. Frontend Integration
- ✅ **AddTributeForm 업데이트**
  - `components/tribute/AddTributeForm.tsx`
  - 실제 API 호출 구현
  - 이미지 업로드 → Storage → DB 저장 플로우
  - 에러 처리 UI 추가
  - **UI는 변경하지 않음** (기존 디자인 유지)

### 3. Dependencies
- ✅ **@supabase/supabase-js 설치**
  ```bash
  npm install @supabase/supabase-js
  ```

### 4. Documentation
- ✅ **QUICK_START.md** - 빠른 시작 가이드
- ✅ **DATABASE_SETUP_GUIDE.md** - 상세 설정 가이드
- ✅ **modal-popup-fix-guide.md** - 모달 UI 수정 히스토리

---

## ⚠️ 남은 작업 (필수!)

### 🔴 환경 변수 설정

**파일 위치**: `.env.local` (프로젝트 루트)

**현재 상태**: 템플릿만 생성됨

**해야 할 일**:
1. Supabase Dashboard에서 3개의 키 복사
2. `.env.local` 파일에 실제 값 입력
3. 서버 자동 재시작 확인

**가이드**: [QUICK_START.md](QUICK_START.md) 참고

---

## 🔄 데이터 플로우

```
사용자 입력 (AddTributeForm)
    ↓
이미지 있으면?
    ↓ YES
uploadImageToStorage(file)
    ↓
Supabase Storage (tranphuong bucket)
    ↓
Public URL 반환
    ↓
fetch('/api/tributes', {
  method: 'POST',
  body: {
    name: '홍길동',
    position: '손자',        // UI: relationship → DB: position
    contents: '할아버지...',
    image_url: 'https://...'
  }
})
    ↓
API Route (/app/api/tributes/route.ts)
    ↓
Supabase Admin Client
    ↓
INSERT INTO replies (...)
    ↓
SUCCESS
    ↓
Alert 메시지 → 모달 닫기
```

---

## 📁 파일 구조

```
memorial-website/
├── .env.local                          ⚠️ 환경 변수 설정 필요!
├── QUICK_START.md                      📘 빠른 시작 가이드
├── README_DATABASE.md                  📘 이 문서
│
├── app/
│   └── api/
│       └── tributes/
│           └── route.ts                ✅ API 엔드포인트
│
├── components/
│   └── tribute/
│       ├── AddTributeButton.tsx        ✅ 모달 트리거
│       └── AddTributeForm.tsx          ✅ API 연동 완료 (UI 변경 없음)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   ✅ Supabase 클라이언트
│   │   └── server.ts                   ✅ Supabase 서버 (Admin)
│   └── utils/
│       └── uploadImage.ts              ✅ 이미지 업로드 함수
│
└── docs/
    ├── DATABASE_SETUP_GUIDE.md         📘 상세 가이드
    └── modal-popup-fix-guide.md        📘 모달 수정 히스토리
```

---

## 🎯 UI → DB 매핑

| UI 필드 | FormData Key | API Body Key | DB Column | 설명 |
|---------|-------------|--------------|-----------|------|
| "Tên của bạn" | `name` | `name` | `name` | 작성자 이름 |
| "Mối quan hệ" | `relationship` | `position` | `position` | 관계 (손자, 친구 등) |
| "Lời nhắn gửi" | `message` | `contents` | `contents` | 방명록 내용 |
| "Ảnh" | `selectedImage` | `image_url` | `image_url` | Storage URL |

**중요**: UI에서는 `relationship`이지만 DB에는 `position`으로 저장됩니다.

---

## 🔍 테스트 방법

### 1. 환경 변수 확인 (브라우저 콘솔)
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// 출력: https://jqdhncxratnfyaymevtu.supabase.co
```

### 2. 폼 제출 테스트
1. http://localhost:3001 접속
2. "Thêm lời tri ân" 클릭
3. 폼 작성 후 제출
4. Network 탭에서 `/api/tributes` 요청 확인
   - Status: 201 Created ✅
   - Response: `{ success: true }`

### 3. Database 확인
Supabase Dashboard → Table Editor → `replies`
- 새 데이터 확인
- `image_url` 컬럼에 Storage URL 확인

---

## 🐛 일반적인 문제

### 문제 1: "Missing env.NEXT_PUBLIC_SUPABASE_URL"
**원인**: 환경 변수 미설정
**해결**: [QUICK_START.md](QUICK_START.md) Step 2 참고

### 문제 2: "Tải ảnh lên thất bại"
**원인**: Storage Bucket 미설정
**해결**: [QUICK_START.md](QUICK_START.md) Step 4 참고

### 문제 3: 환경 변수가 `undefined`
**원인**: 서버 재시작 필요
**해결**: Ctrl+C 후 `npm run dev`

---

## 📊 Database Schema

### `replies` 테이블

```sql
CREATE TABLE replies (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  name text,
  position text,              -- UI의 "relationship"
  contents text,
  image_url text,
  is_deleted boolean DEFAULT false
);
```

### Storage Bucket: `tranphuong`

폴더 구조:
```
tranphuong/
└── replies/
    ├── 2025/
    │   └── 10/
    │       ├── uuid-1.jpg
    │       ├── uuid-2.png
    │       └── uuid-3.webp
    └── 2025/
        └── 11/
            └── ...
```

---

## 🚀 다음 단계

### 1. 환경 변수 설정 (지금!)
- `.env.local` 파일 수정
- Supabase 키 입력

### 2. 테스트
- 폼 제출
- Database 확인

### 3. 추가 기능 구현 (선택사항)
- [ ] 방명록 목록 페이지
- [ ] 실시간 업데이트 (Realtime)
- [ ] 이미지 최적화 (리사이징)
- [ ] 관리자 페이지 (삭제, 승인)

---

## 📞 참고 자료

- **Supabase Dashboard**: https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Env Variables**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

---

## ✨ 요약

**UI는 전혀 변경되지 않았습니다!**

기존 AddTributeForm의 디자인과 동작은 그대로 유지하면서, 내부적으로만 Supabase API 호출 로직을 추가했습니다.

**남은 작업**: `.env.local` 파일에 Supabase 키만 입력하면 바로 사용 가능합니다!

---

**작성일**: 2025-10-23
**버전**: 1.0
**상태**: Backend 완료, 환경 변수 설정 대기 중
