# Supabase Storage & Replies 테이블 통합 가이드
## Memorial Website - 방명록 이미지 업로드 구현

---

## 📋 목차
1. [프로젝트 현황](#1-프로젝트-현황)
2. [Supabase 설정](#2-supabase-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [Supabase 클라이언트 설정](#4-supabase-클라이언트-설정)
5. [Storage 업로드 유틸리티](#5-storage-업로드-유틸리티)
6. [API Route 생성](#6-api-route-생성)
7. [AddTributeForm 수정](#7-addtributeform-수정)
8. [테스트 및 검증](#8-테스트-및-검증)

---

## 1. 프로젝트 현황

### 기술 스택
- **Frontend**: Next.js 15.5.6 + React 19.1.0 + TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Storage)
- **Project ID**: `jqdhncxratnfyaymevtu`

### 현재 구조
```
memorial-website/
├── app/
│   └── api/                    # ✅ API Routes 생성 필요
├── components/
│   └── tribute/
│       └── AddTributeForm.tsx  # ✅ Supabase 통합 필요
└── lib/
    └── supabase/               # ✅ 클라이언트 설정 필요
```

### `replies` 테이블 스키마
| 컬럼명 | 타입 | Nullable | Default | 설명 |
|--------|------|----------|---------|------|
| `id` | bigint | NO | auto | Primary Key |
| `created_at` | timestamptz | NO | now() | 생성 시간 |
| `name` | text | YES | null | 작성자 이름 |
| `contents` | text | YES | null | 방명록 내용 |
| `is_deleted` | boolean | YES | null | Soft delete |
| `position` | text | YES | null | 관계 (손자, 친구 등) |
| `image_url` | text | YES | null | **Storage 이미지 URL** |

---

## 2. Supabase 설정

### 2.1 Storage Bucket 확인
Supabase Dashboard에서 `tranphuong` 버킷이 존재하는지 확인하세요.

### 2.2 Storage 정책 설정
```sql
-- 1. Public 읽기 허용
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tranphuong');

-- 2. Public 업로드 허용 (익명 사용자도 방명록 작성 가능)
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'tranphuong' 
  AND (storage.foldername(name))[1] = 'replies'
);

-- 3. 업로드한 사용자만 삭제 가능 (선택사항)
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'tranphuong');
```

### 2.3 Bucket 설정 확인
- **Public bucket**: ✅ 체크 (이미지 URL 공개 접근)
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

---

## 3. 환경 변수 설정

### 3.1 `.env.local` 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jqdhncxratnfyaymevtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service Role Key (서버 사이드 전용)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3.2 Anon Key 및 Service Role Key 가져오기
Supabase Dashboard → Settings → API에서 확인:
- **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role**: `SUPABASE_SERVICE_ROLE_KEY` (민감 정보)

### 3.3 `.gitignore` 확인
```.gitignore
# Environment variables
.env
.env.local
.env.*.local
```

---

## 4. Supabase 클라이언트 설정

### 4.1 Supabase 패키지 설치
```bash
npm install @supabase/supabase-js
```

### 4.2 클라이언트 생성: `lib/supabase/client.ts`
```typescript
import { createClientComponentClient } from '@supabase/supabase-js'

export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
})

// TypeScript 타입 정의
export type Reply = {
  id: number
  created_at: string
  name: string | null
  contents: string | null
  is_deleted: boolean | null
  position: string | null
  image_url: string | null
}
```

### 4.3 서버 사이드 클라이언트: `lib/supabase/server.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

---

## 5. Storage 업로드 유틸리티

### 5.1 유틸리티 함수: `lib/utils/uploadImage.ts`
```typescript
import { supabase } from '@/lib/supabase/client'

const BUCKET_NAME = 'tranphuong'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function uploadImageToStorage(
  file: File
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    // 1. 파일 유효성 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: '허용되지 않은 파일 형식입니다. (JPG, PNG, GIF, WEBP만 가능)'
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `파일 크기가 너무 큽니다. (최대 ${MAX_FILE_SIZE / 1024 / 1024}MB)`
      }
    }

    // 2. 고유 파일명 생성
    const fileExt = file.name.split('.').pop()
    const now = new Date()
    const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`
    const fileName = `replies/${yearMonth}/${crypto.randomUUID()}.${fileExt}`

    // 3. Storage에 업로드
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: '이미지 업로드에 실패했습니다.' }
    }

    // 4. Public URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return { success: true, url: publicUrl }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' }
  }
}
```

---

## 6. API Route 생성

### 6.1 API Route: `app/api/tributes/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, position, contents, image_url } = body

    // 1. 입력 검증
    if (!name || !contents) {
      return NextResponse.json(
        { error: '이름과 메시지는 필수 입력 항목입니다.' },
        { status: 400 }
      )
    }

    if (contents.length < 10) {
      return NextResponse.json(
        { error: '메시지는 최소 10자 이상 입력해주세요.' },
        { status: 400 }
      )
    }

    // 2. Supabase에 데이터 삽입
    const { data, error } = await supabaseAdmin
      .from('replies')
      .insert({
        name: name.trim(),
        position: position?.trim() || null,
        contents: contents.trim(),
        image_url: image_url || null,
        is_deleted: false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '데이터 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        data,
        message: '감사합니다! 귀하의 방명록이 성공적으로 등록되었습니다.' 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 방명록 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error, count } = await supabaseAdmin
      .from('replies')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '데이터 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
```

---

## 7. AddTributeForm 수정

### 7.1 수정된 `components/tribute/AddTributeForm.tsx`
```typescript
'use client';

import { useState, useRef } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import { uploadImageToStorage } from '@/lib/utils/uploadImage';

interface AddTributeFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddTributeForm({ onClose, onSuccess }: AddTributeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    message: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }

      // 파일 형식 체크
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleOpenFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl: string | null = null;

      // 1. 이미지가 있으면 먼저 업로드
      if (selectedImage) {
        const uploadResult = await uploadImageToStorage(selectedImage);
        
        if (!uploadResult.success) {
          setError(uploadResult.error);
          setIsSubmitting(false);
          return;
        }
        
        imageUrl = uploadResult.url;
      }

      // 2. API로 방명록 데이터 전송
      const response = await fetch('/api/tributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          position: formData.relationship || null,
          contents: formData.message,
          image_url: imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '방명록 등록에 실패했습니다.');
      }

      // 3. 성공 처리
      alert(result.message || '감사합니다! 귀하의 방명록이 등록되었습니다.');
      
      // 폼 초기화
      setFormData({ name: '', relationship: '', message: '' });
      setSelectedImage(null);
      setImagePreview(null);
      
      // 부모 컴포넌트에 성공 알림
      onSuccess?.();
      onClose();

    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    formData.name.trim().length > 0 && 
    formData.message.trim().length >= 10;

  return (
    <div className="bg-white rounded-lg shadow-xl w-full h-full overflow-y-auto relative">
      {/* Sticky Header with Close Button */}
      <div className="sticky top-0 bg-white z-[10002] border-b border-gray-200 px-6 pt-6 pb-4 md:px-8">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 right-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Đóng"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-4">
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tên của bạn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Nhập tên của bạn"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Relationship Field */}
        <div className="mb-4">
          <label
            htmlFor="relationship"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mối quan hệ
          </label>
          <input
            type="text"
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Ví dụ: Học sinh, đồng nghiệp, bạn bè..."
            disabled={isSubmitting}
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh (tùy chọn)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            aria-label="Chọn ảnh"
            disabled={isSubmitting}
          />

          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleOpenFileBrowser}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={isSubmitting}
              >
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-600">Chọn tệp</span>
              </button>

              <button
                type="button"
                onClick={handleOpenFileBrowser}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={isSubmitting}
              >
                <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-600">Thư viện</span>
              </button>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            최대 5MB, JPG/PNG/GIF/WEBP 형식
          </p>
        </div>

        {/* Message Field */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Lời nhắn gửi <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Chia sẻ kỷ niệm và lời tưởng nhớ của bạn..."
            required
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500">
            Tối thiểu 10 ký tự ({formData.message.length}/10)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang gửi...
            </>
          ) : (
            'Gửi lời tri ân'
          )}
        </button>
      </form>
    </div>
  );
}
```

---

## 8. 테스트 및 검증

### 8.1 개발 서버 실행
```bash
npm run dev
```

### 8.2 테스트 시나리오

#### ✅ 정상 케이스
1. **이미지 없이 방명록 작성**
   - 이름: "홍길동"
   - 관계: "학생"
   - 메시지: "선생님을 항상 기억하겠습니다."
   - 결과: DB에 `image_url: null`로 저장

2. **이미지와 함께 방명록 작성**
   - 이미지 선택 (2MB JPG)
   - 폼 작성 후 제출
   - 결과: Storage에 업로드 → DB에 public URL 저장

#### ❌ 에러 케이스
1. **파일 크기 초과**
   - 6MB 이미지 업로드 시도
   - 결과: "파일 크기가 너무 큽니다" 에러 표시

2. **잘못된 파일 형식**
   - PDF 또는 EXE 파일 업로드
   - 결과: "이미지 파일만 업로드 가능합니다" 에러

3. **필수 필드 누락**
   - 이름 또는 메시지 미입력
   - 결과: Submit 버튼 비활성화

### 8.3 데이터베이스 확인
```sql
-- Supabase SQL Editor에서 실행
SELECT 
  id,
  name,
  position,
  contents,
  image_url,
  created_at,
  is_deleted
FROM replies
WHERE is_deleted = false
ORDER BY created_at DESC
LIMIT 10;
```

### 8.4 Storage 확인
Supabase Dashboard → Storage → `tranphuong` → `replies/YYYY/MM/` 폴더 확인

---

## 9. 프로덕션 배포 체크리스트

### Before Deploy
- [ ] `.env.local`의 모든 키 검증
- [ ] Storage 정책 설정 완료
- [ ] API Rate Limiting 고려
- [ ] 이미지 최적화 (WebP 변환 등)
- [ ] Error Boundary 추가

### Vercel 환경 변수 설정
```
NEXT_PUBLIC_SUPABASE_URL=https://jqdhncxratnfyaymevtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***
```

### 모니터링
- Supabase Dashboard에서 Storage 사용량 확인
- Database 쿼리 성능 모니터링
- Error logs 확인

---

## 10. 추가 개선 사항

### 10.1 이미지 최적화
```typescript
// lib/utils/optimizeImage.ts
export async function optimizeImage(file: File): Promise<File> {
  // Canvas API를 사용한 리사이징 및 압축
  // WebP 변환
  // ...
}
```

### 10.2 Spam 방지
- Rate Limiting (IP 기반)
- reCAPTCHA 추가
- Content Moderation

### 10.3 실시간 업데이트
```typescript
// Supabase Realtime 구독
useEffect(() => {
  const channel = supabase
    .channel('replies')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'replies' },
      (payload) => {
        console.log('New reply:', payload.new)
        // UI 업데이트
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

---

## 11. 문제 해결 (Troubleshooting)

### Q1: "Storage policy does not allow insert" 에러
**A**: Storage 정책 재확인
```sql
-- 정책 확인
SELECT * FROM storage.policies WHERE bucket_id = 'tranphuong';
```

### Q2: CORS 에러 발생
**A**: Supabase Dashboard → Settings → API → CORS에서 도메인 추가

### Q3: 이미지 URL이 404 반환
**A**: Bucket이 Public인지 확인
```sql
UPDATE storage.buckets 
SET public = true 
WHERE id = 'tranphuong';
```

### Q4: 환경 변수가 인식되지 않음
**A**: 
1. `.env.local` 파일 위치 확인 (프로젝트 루트)
2. 개발 서버 재시작 (`npm run dev` 다시 실행)
3. `NEXT_PUBLIC_` 접두사 확인

---

## 12. 참고 자료

- [Supabase Storage 문서](https://supabase.com/docs/guides/storage)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [@supabase/supabase-js](https://github.com/supabase/supabase-js)
- [Tailwind CSS](https://tailwindcss.com/)

---

**작성일**: 2025-10-23  
**프로젝트**: Memorial Website - Grandpa Memorial  
**버전**: 1.0  
**작성자**: Claude + 사용자

**다음 단계**: 
1. ✅ 환경 변수 설정
2. ✅ Supabase 클라이언트 생성
3. ✅ API Route 구현
4. ✅ Form 컴포넌트 수정
5. 🔲 테스트 및 배포
