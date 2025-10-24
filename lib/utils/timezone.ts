/**
 * 베트남 시간대 변환 유틸리티
 * Supabase는 UTC로 시간을 저장하므로, 베트남 시간(GMT+7)으로 변환 필요
 */

/**
 * UTC 시간을 베트남 시간(GMT+7)으로 변환
 * @param utcDate - UTC 시간 (ISO string 또는 Date 객체)
 * @returns 베트남 시간으로 변환된 Date 객체
 */
export function convertToVietnamTime(utcDate: string | Date): Date {
  const date = new Date(utcDate);

  // 베트남 시간대는 UTC+7
  const vietnamOffset = 7 * 60; // 7시간 = 420분

  // 현재 시스템의 UTC offset (분 단위)
  const localOffset = date.getTimezoneOffset();

  // 총 offset 계산 (베트남 시간으로 조정)
  const totalOffset = vietnamOffset + localOffset;

  // offset을 밀리초로 변환하여 적용
  return new Date(date.getTime() + totalOffset * 60 * 1000);
}

/**
 * ISO 날짜 문자열을 베트남 시간 기준 날짜 문자열로 포맷
 * @param utcDate - UTC 시간 (ISO string 또는 Date 객체)
 * @returns YYYY-MM-DD 형식의 베트남 날짜 문자열
 *
 * @example
 * formatVietnamDate("2025-10-23T17:00:00Z") // UTC 오후 5시
 * // returns "2025-10-24" (베트남은 다음날 00:00)
 */
export function formatVietnamDate(utcDate: string | Date): string {
  const vnDate = convertToVietnamTime(utcDate);

  const year = vnDate.getFullYear();
  const month = String(vnDate.getMonth() + 1).padStart(2, '0');
  const day = String(vnDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * ISO 날짜 문자열을 베트남 시간 기준 날짜/시간 문자열로 포맷
 * @param utcDate - UTC 시간 (ISO string 또는 Date 객체)
 * @returns YYYY-MM-DD HH:MM 형식의 베트남 날짜/시간 문자열
 */
export function formatVietnamDateTime(utcDate: string | Date): string {
  const vnDate = convertToVietnamTime(utcDate);

  const year = vnDate.getFullYear();
  const month = String(vnDate.getMonth() + 1).padStart(2, '0');
  const day = String(vnDate.getDate()).padStart(2, '0');
  const hours = String(vnDate.getHours()).padStart(2, '0');
  const minutes = String(vnDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
