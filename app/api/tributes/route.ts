import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, position, contents, image_url } = body

    // 1. 입력 검증: 내용 또는 이미지 중 하나는 필수
    if (!contents && !image_url) {
      return NextResponse.json(
        { error: 'Nội dung hoặc ảnh là bắt buộc' },
        { status: 400 }
      )
    }

    // 2. 이름이 없으면 기본값 "Tưởng nhớ" 사용
    const finalName = name && name.trim() ? name.trim() : 'Tưởng nhớ';

    // 3. Supabase에 데이터 삽입
    const { data, error } = await supabaseAdmin
      .from('replies')
      .insert({
        name: finalName,
        position: position?.trim() || null,
        contents: contents?.trim() || null,
        image_url: image_url || null,
        is_deleted: false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Lỗi khi lưu dữ liệu' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        data,
        message: 'Cảm ơn bạn! Lời tri ân của bạn đã được ghi nhận.' 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trên server' },
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
        { error: 'Lỗi khi truy vấn dữ liệu' },
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
      { error: 'Đã xảy ra lỗi trên server' },
      { status: 500 }
    )
  }
}
