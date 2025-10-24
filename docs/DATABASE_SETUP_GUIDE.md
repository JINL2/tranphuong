# Database Setup Guide - Memorial Website

## 🎯 목표

AddTributeForm UI와 Supabase `replies` 테이블을 연결하여 실제 데이터베이스에 방명록을 저장합니다.

---

## ✅ 완료된 작업

### 1. Supabase 클라이언트 설정 ✅
- **파일**: `lib/supabase/client.ts` - 클라이언트용
- **파일**: `lib/supabase/server.ts` - 서버용 (Admin)

### 2. 이미지 업로드 유틸리티 ✅
- **파일**: `lib/utils/uploadImage.ts`
- Storage Bucket: `tranphuong`
- 자동 검증: 파일 타입, 크기 (최대 5MB)

### 3. API Routes ✅
- **파일**: `app/api/tributes/route.ts`
- POST: 방명록 생성
- GET: 방명록 목록 조회 (pagination)

### 4. AddTributeForm 업데이트 ✅
- **파일**: `components/tribute/AddTributeForm.tsx`
- 실제 API 호출 구현
- 이미지 업로드 → DB 저장 플로우
- 에러 처리 UI 추가

### 5. Supabase 패키지 설치 ✅
```bash
npm install @supabase/supabase-js
```

---

## 🔧 환경 설정 (필수!)

### Step 1: Supabase 프로젝트 정보 확인

1. **Supabase Dashboard** 접속
   - https://supabase.com/dashboard

2. **프로젝트 선택** (jqdhncxratnfyaymevtu)

3. **Settings → API** 메뉴로 이동

4. 다음 정보 복사:
   - **Project URL**: `https://jqdhncxratnfyaymevtu.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ⚠️ 비밀!

---

### Step 2: 환경 변수 파일 수정

`.env.local` 파일이 이미 생성되어 있습니다. 실제 값으로 교체하세요:

```bash
# .env.local

# Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://jqdhncxratnfyaymevtu.supabase.co

# Supabase Anon Key (공개 가능)
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_key_붙여넣기

# Supabase Service Role Key (서버 전용 - 비밀!)
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_key_붙여넣기
```

**⚠️ 중요:**
- `.env.local`은 Git에 커밋하지 마세요!
- `.gitignore`에 이미 포함되어 있습니다

---

### Step 3: Storage Bucket 확인

Supabase Dashboard에서 **Storage** 메뉴 확인:

1. **Bucket 이름**: `tranphuong` ✅
2. **Public 액세스**: 활성화 필요

#### Bucket 정책 설정 (필요시)

```sql
-- Public 읽기 허용
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tranphuong');

-- 인증된 사용자 업로드 허용
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tranphuong');

-- 또는 익명 업로드 허용 (선택사항)
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'tranphuong');
```

---

### Step 4: `replies` 테이블 구조 확인

| 컬럼명 | 타입 | Nullable | 설명 |
|--------|------|----------|------|
| `id` | bigint | NO | 자동 증가 Primary Key |
| `created_at` | timestamptz | NO | 생성 시간 (자동) |
| `name` | text | YES | 작성자 이름 |
| `contents` | text | YES | 방명록 내용 |
| `is_deleted` | boolean | YES | Soft delete |
| `position` | text | YES | **relationship 매핑!** |
| `image_url` | text | YES | Storage 이미지 URL |

**⚠️ 중요: UI `relationship` → DB `position`**

---

## 🔄 데이터 흐름

```
사용자 입력
   ↓
1. 이미지 선택 → uploadImageToStorage()
   ↓
2. Storage에 업로드 → Public URL 반환
   ↓
3. fetch('/api/tributes', { POST }) → 데이터 + URL 전송
   ↓
4. API Route → Supabase DB INSERT
   ↓
5. 성공 메시지 → 모달 닫기
```

### 코드 플로우

```typescript
// 1. 사용자가 폼 제출
handleSubmit(e) {

  // 2. 이미지 업로드 (있으면)
  if (selectedImage) {
    uploadResult = await uploadImageToStorage(selectedImage)
    imageUrl = uploadResult.url
  }

  // 3. API 호출
  response = await fetch('/api/tributes', {
    method: 'POST',
    body: JSON.stringify({
      name: '홍길동',
      position: '손자',  // UI의 relationship → DB의 position
      contents: '할아버지...',
      image_url: imageUrl
    })
  })

  // 4. 성공 처리
  alert('감사합니다!')
  onClose()
}
```

---

## 🧪 테스트 가이드

### 1. 서버 실행 확인

```bash
npm run dev
```

http://localhost:3001 접속

### 2. 브라우저 콘솔 확인

F12 → Console 탭에서 에러 확인

### 3. 환경 변수 확인

브라우저 콘솔에서:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// 출력: https://jqdhncxratnfyaymevtu.supabase.co
```

`undefined`가 나오면:
1. `.env.local` 파일 위치 확인 (프로젝트 루트)
2. 서버 재시작 (Ctrl+C 후 `npm run dev`)

---

### 4. 테스트 시나리오

#### ✅ 정상 케이스

1. "Thêm lời tri ân" 버튼 클릭
2. 폼 작성:
   - 이름: 테스트 사용자
   - 관계: 손자
   - 이미지: 선택 (선택사항)
   - 메시지: 테스트 메시지입니다 (최소 10자)
3. "Gửi lời tri ân" 클릭
4. 기대 결과:
   - ✅ 로딩 표시 ("Đang gửi...")
   - ✅ Alert 성공 메시지
   - ✅ 모달 자동 닫힘
   - ✅ Supabase DB에 데이터 저장됨

#### ❌ 에러 케이스 1: 환경 변수 미설정

**증상:**
```
Error: Missing env.NEXT_PUBLIC_SUPABASE_URL
```

**해결:**
1. `.env.local` 파일 확인
2. 변수 이름 정확히 입력했는지 확인
3. 서버 재시작

#### ❌ 에러 케이스 2: Storage 업로드 실패

**증상:**
```
Tải ảnh lên thất bại
```

**해결:**
1. Storage Bucket `tranphuong` 존재 확인
2. Public policy 설정 확인
3. 파일 크기 5MB 이하 확인

#### ❌ 에러 케이스 3: DB 삽입 실패

**증상:**
```
Lỗi khi lưu dữ liệu
```

**해결:**
1. Service Role Key 확인
2. `replies` 테이블 존재 확인
3. 서버 콘솔 에러 로그 확인

---

## 🔍 디버깅

### 서버 콘솔 확인

```bash
npm run dev
```

출력 예시:
```
✓ Ready in 1.5s
○ Compiling /api/tributes/route ...
✓ Compiled /api/tributes/route in 234ms
POST /api/tributes 201 in 523ms
```

### 네트워크 탭 확인

1. F12 → Network 탭
2. "Gửi lời tri ân" 클릭
3. `tributes` 요청 확인:
   - Status: 201 Created ✅
   - Response: `{ success: true, data: {...} }`

### Supabase Dashboard 확인

1. https://supabase.com/dashboard
2. **Table Editor** → `replies` 테이블
3. 새 데이터가 추가되었는지 확인

---

## 📊 데이터베이스 직접 확인

### SQL Editor에서 조회

```sql
-- 최근 10개 방명록 조회
SELECT
  id,
  name,
  position,
  contents,
  image_url,
  created_at
FROM replies
WHERE is_deleted = false
ORDER BY created_at DESC
LIMIT 10;
```

### 특정 사용자 조회

```sql
SELECT * FROM replies
WHERE name = '테스트 사용자'
AND is_deleted = false;
```

---

## 🚀 다음 단계

### 1. 방명록 목록 표시 페이지 만들기

```typescript
// pages/tributes.tsx
export default function TributesPage() {
  const [tributes, setTributes] = useState([])

  useEffect(() => {
    fetch('/api/tributes')
      .then(res => res.json())
      .then(data => setTributes(data.data))
  }, [])

  return (
    <div>
      {tributes.map(tribute => (
        <TributeCard key={tribute.id} {...tribute} />
      ))}
    </div>
  )
}
```

### 2. 실시간 업데이트 (Supabase Realtime)

```typescript
import { supabase } from '@/lib/supabase/client'

useEffect(() => {
  const subscription = supabase
    .channel('replies')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'replies'
    }, (payload) => {
      console.log('새 방명록:', payload.new)
      // UI 업데이트
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

### 3. 이미지 최적화

```typescript
// lib/utils/optimizeImage.ts
import sharp from 'sharp'

export async function optimizeImage(file: File) {
  const buffer = await file.arrayBuffer()

  const optimized = await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside' })
    .jpeg({ quality: 85 })
    .toBuffer()

  return new File([optimized], file.name, { type: 'image/jpeg' })
}
```

---

## 📝 체크리스트

설정 완료 전 확인:

- [ ] Supabase 프로젝트 생성 완료
- [ ] `.env.local` 파일에 3개 환경 변수 설정
- [ ] `tranphuong` Storage Bucket 존재
- [ ] Storage Public policy 설정
- [ ] `replies` 테이블 존재 및 컬럼 확인
- [ ] `@supabase/supabase-js` 패키지 설치
- [ ] 서버 실행 (`npm run dev`)
- [ ] 테스트 제출 성공
- [ ] Supabase Dashboard에서 데이터 확인

---

## 🆘 문제 해결

### 문제: "Module not found: Can't resolve '@supabase/supabase-js'"

**해결:**
```bash
npm install @supabase/supabase-js
```

### 문제: 환경 변수가 `undefined`

**해결:**
1. 파일명 확인: `.env.local` (점으로 시작!)
2. 위치 확인: 프로젝트 루트 (package.json과 같은 폴더)
3. 서버 재시작
4. 브라우저 새로고침 (Cmd+Shift+R / Ctrl+Shift+R)

### 문제: CORS 에러

**해결:**
- Supabase Dashboard → Settings → API
- "Project URL" 확인
- Next.js는 같은 도메인이므로 CORS 문제 없음

### 문제: 이미지 업로드는 되는데 DB 저장 안 됨

**해결:**
1. API Route 콘솔 로그 확인
2. Service Role Key 확인
3. `replies` 테이블 권한 확인 (RLS 정책)

---

## 📚 참고 자료

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

---

**작성일**: 2025-10-23
**버전**: 1.0
**최종 업데이트**: UI-DB 연동 완료
