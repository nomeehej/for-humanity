// ----------------------------------------------------------------------------------------
// HTTP 응답 상태
//
// http_status_partial_content: 단일 바이트 범위 요청의 부분 응답
// http_status_range_not_satisfiable: 파일 크기 초과 범위 요청
// http_status_not_found: 없는 문서
// ----------------------------------------------------------------------------------------
export const http_status_partial_content = 206;
export const http_status_range_not_satisfiable = 416;
export const http_status_not_found = 404;
