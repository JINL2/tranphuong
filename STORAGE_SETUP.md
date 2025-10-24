# Storage Bucket Setup Guide

## 🎯 Storage Bucket: `tranphuong`

이 가이드는 Supabase Storage Bucket을 설정하는 방법입니다.

---

## Step 1: Bucket 존재 여부 확인

1. **Supabase Dashboard 접속**
   ```
   https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu/storage/buckets
   ```

2. **`tranphuong` Bucket 찾기**
   - ✅ 있으면 → Step 2로 이동
   - ❌ 없으면 → 아래 "Bucket 생성" 참고

---

## Step 2: Bucket 생성 (없는 경우만)

1. **"New bucket" 버튼 클릭**

2. **설정 입력:**
   ```
   Name: tranphuong
   Public bucket: ON (체크!)
   ```

3. **"Create bucket" 클릭**

---

## Step 3: Storage 정책 설정

### 방법 1: UI에서 설정

1. **Storage → Policies 탭**

2. **"New Policy" 클릭**

3. **템플릿 선택:**
   - "Allow public read access"
   - "Allow public write access" (또는 authenticated만)

### 방법 2: SQL로 설정 (권장!)

**SQL Editor**로 이동 후 아래 실행:

```sql
-- 1. Public 읽기 허용 (필수!)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tranphuong');

-- 2. Public 업로드 허용 (선택 1 - 누구나 업로드 가능)
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'tranphuong');

-- 또는

-- 2. 인증된 사용자만 업로드 (선택 2 - 더 안전)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tranphuong');
```

**권장**: 테스트 단계에서는 Public upload를 활성화하고, 프로덕션에서는 authenticated로 변경

---

## Step 4: 폴더 구조 (자동 생성됨)

이미지를 업로드하면 자동으로 아래와 같은 구조가 생성됩니다:

```
tranphuong/
└── replies/
    └── 2025/
        └── 10/
            ├── uuid-1.jpg
            ├── uuid-2.png
            └── uuid-3.webp
```

**년/월별로 자동 정리됩니다!**

---

## ✅ 확인 방법

### 테스트 업로드

1. **Storage → tranphuong Bucket**

2. **"Upload file" 클릭**

3. **아무 이미지 업로드**

4. **Public URL 확인**
   - 이미지 클릭 → "Get public URL"
   - URL이 생성되면 ✅ 설정 완료!

---

## 🔍 문제 해결

### 문제: "Bucket not found"

**원인:** Bucket이 없음

**해결:** Step 2 참고 (Bucket 생성)

### 문제: "Access denied"

**원인:** 정책이 설정되지 않음

**해결:** Step 3 참고 (SQL 정책 실행)

### 문제: Public URL이 작동하지 않음

**원인:** Bucket이 Private로 설정됨

**해결:**
1. Storage → tranphuong Bucket 설정
2. "Make public" 클릭

---

## 🎯 다음 단계

Storage 설정이 완료되면:

1. ✅ 웹사이트에서 이미지 업로드 테스트
2. ✅ Database에 URL 저장 확인
3. ✅ 이미지가 정상 표시되는지 확인

---

**작성일**: 2025-10-23
**목적**: tranphuong Storage Bucket 설정
