// ----------------------------------------------------------------------------------------
// 날짜 상태 문구 패턴
//
// status_date_pattern: 상태 문구 뒤 날짜
// status_candidate_pattern: 미등록 날짜 상태 후보, 등록 문구 치환 뒤 남은 괄호 문구
// ----------------------------------------------------------------------------------------
export const status_date_pattern = String.raw`\d{4}-\d{2}-\d{2}`;
export const status_candidate_pattern = new RegExp(String.raw`\([^()\n]*${status_date_pattern}\)`, "g");
