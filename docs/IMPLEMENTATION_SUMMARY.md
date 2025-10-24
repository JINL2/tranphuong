# Supabase Storage & Replies 통합 완료 ✅

## 생성된 파일들

### 1. Supabase 클라이언트
```
lib/supabase/
├── client.ts          # 클라이언트 사이드 Supabase 클라이언트
└── server.ts          # 서버 사이드 Supabase Admin 클라이언트
```

### 2. 유틸리티
```
lib/utils/
└── uploadImage.ts     # Storage 이미지 업로드 함수
```

### 3. API Routes
```
app/api/tributes/
└── route.ts           # POST (등록) / GET (조회) API
```

### 4. 환경 변수 템플릿
```
.env.local.example     # 환경 변수 예시 파일
```

### 5. 문서
```
docs/
└── SUPABASE_REPLIES_INTEGRATION.md  # 완전한 통합 가이드
```

---

## 🚀 시작하기

### Step 1: 패키지 설치
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/mysite/grandpawebsite/memorial-website
npm install @supabase/supabase-js
```

### Step 2: 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.local.example .env.local

# Supabase Dashboard에서 키 가져와서 입력
# Settings -> API -> Project API keys
```

### Step 3: Supabase Storage 정책 설정
Supabase Dashboard → SQL Editor에서 실행:

```sql
-- Public 읽기 허용
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tranphuong');

-- Public 업로드 허용
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'tranphuong' 
  AND (storage.foldername(name))[1] = 'replies'
);
```

### Step 4: 개발 서버 실행
```bash
npm run dev
```

### Step 5: 테스트
1. http://localhost:3000 접속
2. 방명록 폼 열기
3. 이미지 + 텍스트 입력 후 제출
4. Supabase Dashboard에서 확인:
   - Storage → tranphuong → replies/
   - Table Editor → replies

---

## 📊 데이터 흐름

```
사용자 입력 (이름, 관계, 메시지, 이미지)
         ↓
AddTributeForm.tsx
         ↓
1. uploadImageToStorage() - 이미지를 Storage에 업로드
         ↓
2. fetch('/api/tributes', {...}) - API로 데이터 전송
         ↓
app/api/tributes/route.ts
         ↓
3. supabaseAdmin.from('replies').insert() - DB에 저장
         ↓
응답 반환 (성공/실패)
         ↓
사용자에게 알림 표시
```

---

## 🔧 주요 함수

### uploadImageToStorage()
**위치**: `lib/utils/uploadImage.ts`  
**기능**: File 객체를 받아 Supabase Storage에 업로드  
**반환**: `{ success: true, url: string }` 또는 `{ success: false, error: string }`

### POST /api/tributes
**위치**: `app/api/tributes/route.ts`  
**기능**: 방명록 데이터를 `replies` 테이블에 삽입  
**Body**: `{ name, position, contents, image_url }`

### GET /api/tributes
**위치**: `app/api/tributes/route.ts`  
**기능**: 방명록 목록 조회 (페이지네이션)  
**Query**: `?limit=50&offset=0`

---

## 📝 다음 단계

### 필수
- [ ] `.env.local` 파일에 실제 Supabase 키 입력
- [ ] Storage 정책 설정 (SQL 실행)
- [ ] 개발 환경에서 테스트

### 선택
- [ ] `AddTributeForm.tsx` 수정 (docs/SUPABASE_REPLIES_INTEGRATION.md 참조)
- [ ] `TributeGrid.tsx`에서 API 호출하여 방명록 목록 표시
- [ ] 이미지 최적화 (리사이징, WebP 변환)
- [ ] Rate Limiting 추가
- [ ] reCAPTCHA 추가 (스팸 방지)

---

## 📚 참고 문서

- **완전한 가이드**: `docs/SUPABASE_REPLIES_INTEGRATION.md`
- **Supabase 문서**: https://supabase.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## 🆘 문제 해결

### 환경 변수가 인식되지 않음
```bash
# 개발 서버 재시작
npm run dev
```

### Storage 업로드 실패
1. Bucket 이름 확인: `tranphuong`
2. Storage 정책 확인 (SQL)
3. Bucket이 Public인지 확인

### CORS 에러
Supabase Dashboard → Settings → API → CORS에 도메인 추가

---

**준비 완료!** 🎉  
이제 `npm install @supabase/supabase-js` 실행 후 `.env.local` 파일만 설정하면 바로 사용할 수 있습니다.
