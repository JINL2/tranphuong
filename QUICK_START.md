# 🚀 Quick Start - Database Connection Setup

## 현재 상태

✅ **완료된 작업:**
- Supabase 클라이언트 설정 완료
- 이미지 업로드 함수 구현 완료
- API Routes 구현 완료
- AddTributeForm API 연동 완료
- @supabase/supabase-js 패키지 설치 완료

⚠️ **남은 작업:**
- Supabase 환경 변수 설정 (아래 참고)

---

## 🔴 Step 1: Supabase 키 복사

1. **Supabase Dashboard 접속**
   ```
   https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu/settings/api
   ```

2. **3개의 키 복사:**
   - ✅ Project URL
   - ✅ anon public key
   - ✅ service_role key (비밀!)

---

## 🔴 Step 2: 환경 변수 설정

`.env.local` 파일을 열고 아래 값들을 실제 Supabase 키로 교체하세요:

```bash
# .env.local 파일 위치: 프로젝트 루트
/Applications/XAMPP/xamppfiles/htdocs/mysite/grandpawebsite/memorial-website/.env.local
```

**편집:**
```bash
# 현재 (템플릿)
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 변경 후 (실제 값으로 교체)
NEXT_PUBLIC_SUPABASE_URL=https://jqdhncxratnfyaymevtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...여기에_실제_anon_key_붙여넣기
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...여기에_실제_service_role_key_붙여넣기
```

---

## 🔴 Step 3: 서버 재시작 (자동으로 감지됨!)

환경 변수를 수정하면 Next.js가 자동으로 감지합니다.

만약 감지되지 않으면:
```bash
# Ctrl+C로 서버 종료 후
npm run dev
```

---

## 🔴 Step 4: Storage Bucket 확인

1. **Supabase Dashboard → Storage**
   ```
   https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu/storage/buckets
   ```

2. **`tranphuong` Bucket 확인**
   - ✅ 존재하면 OK
   - ❌ 없으면 생성:
     - New bucket 클릭
     - Name: `tranphuong`
     - Public: ON

3. **정책 설정 (필요시)**

   Storage → Policies → New Policy

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
   WITH CHECK (bucket_id = 'tranphuong');
   ```

---

## 🧪 Step 5: 테스트!

### 1. 브라우저 접속
```
http://localhost:3001
```

### 2. 콘솔 확인 (F12)

환경 변수가 제대로 로드되었는지 확인:
```javascript
// 브라우저 콘솔에서 실행
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

**기대 결과:**
```
Supabase URL: https://jqdhncxratnfyaymevtu.supabase.co
```

**만약 `undefined`가 나오면:**
- `.env.local` 파일 위치 확인 (프로젝트 루트)
- 변수 이름 정확히 입력했는지 확인
- 서버 재시작

### 3. 폼 제출 테스트

1. "Thêm lời tri ân" 버튼 클릭
2. 폼 작성:
   ```
   이름: 테스트 사용자
   관계: 손자
   이미지: (선택사항)
   메시지: 할아버지를 그리워합니다. (최소 10자)
   ```
3. "Gửi lời tri ân" 클릭

**기대 결과:**
- ✅ "Đang gửi..." 로딩 표시
- ✅ Alert 성공 메시지
- ✅ 모달 자동 닫힘

### 4. Supabase Dashboard에서 확인

```
https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu/editor
```

**Table Editor → `replies` 테이블**
- 새 데이터가 추가되었는지 확인
- `name`, `position`, `contents`, `image_url` 값 확인

---

## 🔍 문제 해결

### ❌ 문제 1: "Missing env.NEXT_PUBLIC_SUPABASE_URL"

**원인:** 환경 변수 미설정

**해결:**
1. `.env.local` 파일 존재 확인
2. 파일 위치: 프로젝트 루트 (package.json과 같은 폴더)
3. 변수 이름 정확히 입력 (대소문자 구분!)
4. 서버 재시작

### ❌ 문제 2: "Tải ảnh lên thất bại"

**원인:** Storage Bucket 미설정 또는 권한 문제

**해결:**
1. Supabase Dashboard → Storage
2. `tranphuong` Bucket 존재 확인
3. Public 액세스 ON
4. 정책 설정 (위의 SQL 실행)

### ❌ 문제 3: "Lỗi khi lưu dữ liệu"

**원인:** DB 삽입 권한 또는 테이블 구조 문제

**해결:**
1. Service Role Key 확인 (`.env.local`)
2. `replies` 테이블 존재 확인
3. 컬럼 구조 확인:
   - `id`, `created_at`, `name`, `position`, `contents`, `image_url`, `is_deleted`

**테이블 생성 SQL (필요시):**
```sql
CREATE TABLE replies (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  name text,
  position text,
  contents text,
  image_url text,
  is_deleted boolean DEFAULT false
);

-- RLS 비활성화 (테스트용)
ALTER TABLE replies DISABLE ROW LEVEL SECURITY;
```

### ❌ 문제 4: 콘솔에 CORS 에러

**원인:** 잘못된 Supabase URL

**해결:**
- Supabase URL 확인 (https로 시작)
- 프로젝트 ID 확인 (jqdhncxratnfyaymevtu)

---

## 📊 데이터 흐름 확인

### 브라우저 Network 탭 (F12)

1. Network 탭 열기
2. "Gửi lời tri ân" 클릭
3. 요청 확인:

**1) 이미지 업로드 (있는 경우):**
```
POST https://jqdhncxratnfyaymevtu.supabase.co/storage/v1/object/tranphuong/...
Status: 200 OK
```

**2) DB 삽입:**
```
POST http://localhost:3001/api/tributes
Status: 201 Created
Response: {
  "success": true,
  "data": {...},
  "message": "Cảm ơn bạn!"
}
```

---

## 📝 체크리스트

연동 완료 전 확인:

- [ ] Supabase 프로젝트 생성됨
- [ ] `.env.local` 파일에 3개 환경 변수 설정
- [ ] `tranphuong` Storage Bucket 존재
- [ ] Storage Public 액세스 ON
- [ ] `replies` 테이블 존재
- [ ] 서버 실행 중 (http://localhost:3001)
- [ ] 브라우저 콘솔에서 환경 변수 확인
- [ ] 테스트 제출 성공
- [ ] Supabase Dashboard에서 데이터 확인

---

## 🎯 다음 단계

연동이 완료되면:

1. **방명록 목록 페이지 만들기**
   - API GET `/api/tributes` 사용
   - 카드 UI로 표시

2. **실시간 업데이트 추가**
   - Supabase Realtime 사용
   - 새 방명록이 추가되면 자동 갱신

3. **이미지 최적화**
   - 업로드 전 리사이징
   - Thumbnail 생성

---

## 📚 참고 문서

- [DATABASE_SETUP_GUIDE.md](docs/DATABASE_SETUP_GUIDE.md) - 상세 가이드
- [modal-popup-fix-guide.md](docs/modal-popup-fix-guide.md) - 모달 UI 수정

---

**작성일**: 2025-10-23
**버전**: 1.0
**상태**: UI 완료, DB 연동 대기 중 (환경 변수 설정 필요)
