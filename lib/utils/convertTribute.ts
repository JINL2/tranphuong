/**
 * Supabase Reply 데이터를 Tribute 카드 형식으로 변환하는 유틸리티
 */

import { Reply } from '@/lib/supabase/client';
import { Tribute } from '@/components/tribute/TributeCard';
import { formatVietnamDate } from './timezone';

/**
 * Reply 데이터를 기반으로 Tribute type 자동 판별
 *
 * @param reply - Supabase replies 테이블의 row 데이터
 * @returns 'text' | 'image' | 'story'
 *
 * 판별 로직:
 * - 이미지 O + 텍스트 O → 'story' (이미지 + 스토리 카드)
 * - 이미지 O + 텍스트 X → 'image' (이미지만 있는 카드)
 * - 이미지 X + 텍스트 O → 'text' (텍스트만 있는 카드)
 */
function determineTributeType(reply: Reply): 'text' | 'image' | 'story' {
  const hasImage = !!reply.image_url;
  const hasContent = !!reply.contents && reply.contents.trim().length > 0;

  // 이미지 + 텍스트 → story
  if (hasImage && hasContent) {
    return 'story';
  }

  // 이미지만 → image
  if (hasImage && !hasContent) {
    return 'image';
  }

  // 텍스트만 → text
  return 'text';
}

/**
 * Supabase Reply 객체를 Tribute 객체로 변환
 *
 * @param reply - Supabase replies 테이블의 row 데이터
 * @returns TributeCard 컴포넌트에서 사용할 수 있는 Tribute 객체
 *
 * 매핑:
 * - reply.id → tribute.id
 * - reply.name → tribute.authorName
 * - reply.position → tribute.organization
 * - reply.created_at (UTC) → tribute.date (Vietnam time, YYYY-MM-DD)
 * - reply.contents → tribute.content
 * - reply.image_url → tribute.image
 * - auto-detect → tribute.type
 * - default 'square' → tribute.aspectRatio
 */
export function convertReplyToTribute(reply: Reply): Tribute {
  return {
    id: reply.id,
    type: determineTributeType(reply),
    authorName: reply.name || 'Tưởng nhớ',
    organization: reply.position || '',
    date: formatVietnamDate(reply.created_at), // UTC → Vietnam time
    content: reply.contents || undefined,
    image: reply.image_url || undefined,
    caption: reply.name || undefined,
    aspectRatio: 'square' // 기본값 (추후 이미지 비율 자동 계산 가능)
  };
}

/**
 * Reply 배열을 Tribute 배열로 일괄 변환
 *
 * @param replies - Supabase replies 테이블의 row 배열
 * @returns Tribute 객체 배열
 */
export function convertRepliesToTributes(replies: Reply[]): Tribute[] {
  return replies.map(convertReplyToTribute);
}
