import { supabase } from '@/lib/supabase/client'

const BUCKET_NAME = 'tranphuong'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Image compression settings
// Tribute 카드는 masonry grid에서 최대 400px 정도로 표시되므로
// 2배 해상도(800px)로 설정하여 고해상도 디스플레이에서도 선명하게 표시
const MAX_WIDTH = 800   // 최대 너비 (카드 크기의 2배)
const MAX_HEIGHT = 800  // 최대 높이 (정사각형 기준)
const JPEG_QUALITY = 0.85 // JPEG 압축 품질 (0.0 - 1.0)

/**
 * 이미지를 압축하고 리사이징하는 함수
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // GIF는 압축하지 않고 원본 반환 (애니메이션 보존)
    if (file.type === 'image/gif') {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string

      img.onload = () => {
        // Canvas 생성
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        // 비율 유지하면서 리사이징
        let { width, height } = img

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width
          width = MAX_WIDTH
        }

        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height
          height = MAX_HEIGHT
        }

        canvas.width = width
        canvas.height = height

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height)

        // Blob으로 변환 (압축 적용)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'))
              return
            }

            // File 객체 생성
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, '.jpg'), // 확장자를 .jpg로 통일
              { type: 'image/jpeg' }
            )

            resolve(compressedFile)
          },
          'image/jpeg',
          JPEG_QUALITY
        )
      }

      img.onerror = () => {
        reject(new Error('Image load failed'))
      }
    }

    reader.onerror = () => {
      reject(new Error('File read failed'))
    }
  })
}

export async function uploadImageToStorage(
  file: File
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    // 1. 파일 유효성 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)'
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `Kích thước file vượt quá ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }
    }

    // 2. 이미지 압축 (GIF 제외)
    let fileToUpload = file
    try {
      fileToUpload = await compressImage(file)
      console.log(`이미지 압축 완료: ${(file.size / 1024).toFixed(1)}KB → ${(fileToUpload.size / 1024).toFixed(1)}KB`)
    } catch (compressionError) {
      console.warn('이미지 압축 실패, 원본 업로드:', compressionError)
      // 압축 실패 시 원본 사용
    }

    // 3. 고유 파일명 생성
    const fileExt = fileToUpload.name.split('.').pop()
    const now = new Date()
    const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`
    // Browser-compatible UUID generation using Web Crypto API
    const uuid = self.crypto.randomUUID()
    const fileName = `replies/${yearMonth}/${uuid}.${fileExt}`

    // 4. Storage에 업로드
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileToUpload, {
        contentType: fileToUpload.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Tải ảnh lên thất bại' }
    }

    // 5. Public URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return { success: true, url: publicUrl }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Đã xảy ra lỗi không xác định' }
  }
}
