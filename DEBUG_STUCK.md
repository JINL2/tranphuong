# 🔍 Debug Guide - "Đang gửi..." 멈춤 문제

## 현재 상태

- ✅ Storage에 이미지 업로드 성공
- ✅ `replies` 테이블 RLS 없음
- ❌ "Đang gửi..." 상태에서 멈춤
- ❌ Database에 데이터 삽입 안 됨

---

## 🔍 디버깅 방법

### 1. 브라우저 Network 탭 확인 (가장 중요!)

**F12 → Network 탭**

1. **`tributes` 요청 찾기**
   - POST http://localhost:3001/api/tributes

2. **Status 확인**
   - 200/201: 성공
   - 400: 잘못된 요청
   - 500: 서버 에러
   - (pending): 아직 응답 안 옴 (타임아웃?)

3. **Response 탭 확인**
   - 에러 메시지 확인

4. **Console 탭 확인**
   - 빨간색 에러 메시지

---

### 2. 서버 터미널 확인

**실행 중인 `npm run dev` 터미널 확인**

다음과 같은 에러가 있는지 찾기:
```
POST /api/tributes 500 in 1234ms
Database error: ...
```

---

## 🔧 예상 원인 및 해결

### 원인 1: Service Role Key 문제

**증상**: API가 응답하지 않거나 500 에러

**확인**:
```bash
# .env.local 파일 확인
cat .env.local
```

**해결**:
- `SUPABASE_SERVICE_ROLE_KEY` 값이 올바른지 확인
- Supabase Dashboard → Settings → API에서 다시 복사

---

### 원인 2: 테이블 존재하지 않음

**증상**: "relation "replies" does not exist"

**확인**:
Supabase Dashboard → Table Editor에서 `replies` 테이블 확인

**해결**:
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
```

---

### 원인 3: API Route 에러

**증상**: 서버 콘솔에 에러

**확인**:
`app/api/tributes/route.ts` 파일 확인

**해결**:
API Route 코드 다시 확인

---

### 원인 4: Network 타임아웃

**증상**: Network 탭에서 요청이 계속 pending

**해결**:
- 서버 재시작
- 브라우저 새로고침

---

## 🧪 빠른 테스트

### Test 1: API 직접 호출 (이미지 없이)

**브라우저 Console에서 실행:**

```javascript
fetch('/api/tributes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '테스트',
    position: '손자',
    contents: '테스트 메시지입니다. 최소 10자 이상.',
    image_url: null
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err))
```

**기대 결과:**
```javascript
Success: {
  success: true,
  data: { id: 1, name: "테스트", ... },
  message: "..."
}
```

**실패 시:**
```javascript
Error: { error: "..." }
```

---

### Test 2: Supabase 연결 테스트

**브라우저 Console에서:**

```javascript
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

**기대 결과:**
```
URL: https://jqdhncxratnfyaymevtu.supabase.co
Key exists: true
```

---

## 📝 체크리스트

**다음을 하나씩 확인하세요:**

1. [ ] 브라우저 Network 탭 → `/api/tributes` 요청 상태 확인
2. [ ] 브라우저 Console 탭 → 에러 메시지 확인
3. [ ] 서버 터미널 → API 에러 로그 확인
4. [ ] `.env.local` 파일 → 3개 환경 변수 올바른지 확인
5. [ ] Supabase Dashboard → `replies` 테이블 존재하는지 확인
6. [ ] 위의 Test 1 실행 → 결과 확인

---

## 💡 다음 단계

**위 체크리스트를 확인한 후:**

1. Network 탭의 응답 또는
2. 서버 터미널의 에러 로그를

공유해주시면 정확한 원인을 찾을 수 있습니다!

---

**작성일**: 2025-10-23
**목적**: "Đang gửi..." 멈춤 문제 해결
