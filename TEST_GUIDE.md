# 🧪 Complete Testing Guide

## 현재 상태

✅ 환경 변수 설정 완료
✅ 서버 실행 중 (http://localhost:3001)
✅ AddTributeForm API 연동 완료

---

## 📋 테스트 전 체크리스트

### 1. Supabase Storage 확인

**Storage Bucket: `tranphuong`**

```
https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu/storage/buckets
```

- [ ] Bucket 존재 확인
- [ ] Public 액세스 ON
- [ ] Storage 정책 설정

📘 **가이드**: [STORAGE_SETUP.md](STORAGE_SETUP.md)

---

### 2. Database 테이블 확인

**Table: `replies`**

```
https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu/editor
```

**필요한 컬럼:**
- `id` (bigint, Primary Key)
- `created_at` (timestamptz)
- `name` (text)
- `position` (text) ← UI의 "relationship"
- `contents` (text)
- `image_url` (text)
- `is_deleted` (boolean)

#### 테이블이 없으면 생성:

**SQL Editor에서 실행:**

```sql
CREATE TABLE IF NOT EXISTS replies (
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

-- 또는 Public 액세스 허용
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read replies"
ON replies FOR SELECT
TO public
USING (is_deleted = false);

CREATE POLICY "Anyone can insert replies"
ON replies FOR INSERT
TO public
WITH CHECK (true);
```

---

## 🧪 테스트 시작!

### Test 1: 환경 변수 확인

1. **브라우저에서 http://localhost:3001 접속**

2. **F12 → Console 탭**

3. **다음 명령어 실행:**
   ```javascript
   console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
   ```

4. **기대 결과:**
   ```
   URL: https://jqdhncxratnfyaymevtu.supabase.co
   Key exists: true
   ```

✅ **통과** → Test 2로 이동
❌ **실패** → 서버 재시작 (`npm run dev`)

---

### Test 2: 이미지 없이 제출

1. **"Thêm lời tri ân" 버튼 클릭**

2. **폼 작성:**
   ```
   이름: 테스트 사용자
   관계: 손자
   이미지: (선택하지 않음)
   메시지: 할아버지를 항상 그리워합니다. 건강하세요.
   ```

3. **"Gửi lời tri ân" 클릭**

4. **기대 결과:**
   - ✅ "Đang gửi..." 로딩 표시
   - ✅ Alert: "Cảm ơn bạn đã chia sẻ!"
   - ✅ 모달 자동 닫힘

5. **Network 탭 확인 (F12):**
   ```
   POST /api/tributes
   Status: 201 Created
   Response: {
     "success": true,
     "data": {...},
     "message": "..."
   }
   ```

6. **Supabase Dashboard 확인:**
   ```
   Table Editor → replies
   ```
   - 새 데이터 추가됨
   - `name`: "테스트 사용자"
   - `position`: "손자"
   - `contents`: "할아버지를..."
   - `image_url`: null

✅ **통과** → Test 3로 이동
❌ **실패** → 문제 해결 섹션 참고

---

### Test 3: 이미지 포함 제출

1. **"Thêm lời tri ân" 버튼 클릭**

2. **폼 작성:**
   ```
   이름: 이미지 테스트
   관계: 친구
   이미지: (파일 선택 - JPG/PNG, 5MB 이하)
   메시지: 사진과 함께 추억을 공유합니다.
   ```

3. **"Gửi lời tri ân" 클릭**

4. **기대 결과:**
   - ✅ "Đang gửi..." 로딩 (약간 더 길게)
   - ✅ Alert 성공 메시지
   - ✅ 모달 닫힘

5. **Network 탭 확인:**
   ```
   1) POST https://jqdhncxratnfyaymevtu.supabase.co/storage/v1/object/tranphuong/...
      Status: 200 OK

   2) POST /api/tributes
      Status: 201 Created
   ```

6. **Supabase 확인:**

   **Storage:**
   ```
   Storage → tranphuong → replies/2025/10/
   → 이미지 파일 확인
   ```

   **Database:**
   ```
   Table Editor → replies
   → image_url: https://jqdhncxratnfyaymevtu.supabase.co/storage/v1/object/public/tranphuong/...
   ```

7. **이미지 URL 클릭 → 브라우저에서 이미지 표시 확인**

✅ **통과** → Test 4로 이동
❌ **실패** → 문제 해결 섹션 참고

---

### Test 4: 에러 케이스 테스트

#### 4-1. 필수 필드 누락

1. 이름만 입력, 메시지 비움
2. "Gửi lời tri ân" 버튼 비활성화 확인

✅ **통과**: 버튼 비활성화됨

#### 4-2. 메시지 10자 미만

1. 메시지: "짧아요"
2. 제출 시도
3. 브라우저 기본 validation 작동 확인

✅ **통과**: "최소 10자" 메시지 표시

#### 4-3. 너무 큰 이미지

1. 5MB 이상 이미지 선택
2. 제출 시도
3. 에러 메시지: "Kích thước file vượt quá 5MB"

✅ **통과**: 에러 메시지 표시

#### 4-4. 잘못된 파일 형식

1. .pdf 또는 .exe 파일 선택
2. 제출 시도
3. 에러 메시지: "Chỉ chấp nhận file ảnh..."

✅ **통과**: 에러 메시지 표시

---

## 🔍 문제 해결

### ❌ "Missing env.NEXT_PUBLIC_SUPABASE_URL"

**확인:**
```bash
cat .env.local
```

**해결:**
- `.env.local` 파일 위치: 프로젝트 루트
- 변수 이름 정확히 입력
- 서버 재시작

---

### ❌ "Tải ảnh lên thất bại"

**확인:**
1. Storage Bucket `tranphuong` 존재?
2. Public 액세스 ON?
3. Storage 정책 설정?

**해결:**
[STORAGE_SETUP.md](STORAGE_SETUP.md) 참고

---

### ❌ "Lỗi khi lưu dữ liệu"

**확인:**
1. `replies` 테이블 존재?
2. 컬럼 구조 맞음?
3. Service Role Key 올바름?

**서버 콘솔 로그 확인:**
```bash
# 터미널에서 확인
# Database error: ... 메시지 찾기
```

**해결:**
- 테이블 생성 (위의 SQL 실행)
- RLS 정책 설정 또는 비활성화

---

### ❌ Network 에러 (CORS, 404, etc)

**확인:**
```javascript
// Console에서 실행
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

**해결:**
- Supabase URL 확인
- 프로젝트 ID 확인 (jqdhncxratnfyaymevtu)

---

## 📊 성공 기준

모든 테스트 통과:

- [x] Test 1: 환경 변수 인식됨
- [x] Test 2: 텍스트만 제출 성공
- [x] Test 3: 이미지 포함 제출 성공
- [x] Test 4: 에러 처리 정상 작동

---

## 🎯 다음 단계

테스트 완료 후:

### 1. 방명록 목록 페이지 만들기

**목적**: 저장된 방명록을 화면에 표시

**기능:**
- API GET `/api/tributes` 호출
- 카드 형태로 표시
- 이미지 썸네일 표시
- Pagination

### 2. 실시간 업데이트

**기능:**
- Supabase Realtime 구독
- 새 방명록 추가 시 자동 갱신

### 3. 관리자 페이지

**기능:**
- 방명록 승인/거부
- 부적절한 내용 삭제 (is_deleted = true)

---

## 📝 테스트 결과 기록

**날짜**: 2025-10-23

| 테스트 | 결과 | 비고 |
|--------|------|------|
| Test 1: 환경 변수 | ⬜ |  |
| Test 2: 텍스트만 | ⬜ |  |
| Test 3: 이미지 포함 | ⬜ |  |
| Test 4-1: 필수 필드 | ⬜ |  |
| Test 4-2: 최소 길이 | ⬜ |  |
| Test 4-3: 파일 크기 | ⬜ |  |
| Test 4-4: 파일 형식 | ⬜ |  |

---

**작성일**: 2025-10-23
**버전**: 1.0
**목적**: UI-DB 연동 완전 테스트
