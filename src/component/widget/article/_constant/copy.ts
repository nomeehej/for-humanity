// ----------------------------------------------------------------------------------------
// 지시문 오류 메시지의 앞 문구
//
// copy_error_unknown_directive: 미지원 블록 지시문
// copy_error_directive_syntax: 부품 작성 계약 위반, 부품 이름과 이유 추가
// ----------------------------------------------------------------------------------------

export const copy_error_unknown_directive = "Unknown part";
export const copy_error_directive_syntax = "Invalid part syntax";

// ----------------------------------------------------------------------------------------
// 부품 문법 오류의 이유
//
// copy_error_part_top_level: 문서 최상위가 아닌 ::part
// copy_error_part_container: ::: 블록이 아닌 Note, Details
// copy_error_part_line: 한 줄 지시문이 아닌 ::: 블록의 part
// copy_error_part_plain_title: 텍스트가 아닌 제목
// copy_error_part_empty_title: 빈 제목
// copy_error_part_body: 빈 본문
// copy_error_part_attribute: 미지원 속성, 속성 이름 추가
// copy_error_part_attribute_syntax: 빈 중괄호, 값이 붙은 open, 반복된 open
// copy_error_part_fence: 닫는 fence 누락, 여는 fence보다 짧은 닫는 fence
// copy_error_part_heading: 부품 안의 문서 구획 제목
// copy_error_part_section: 다음 part나 문서 끝까지 ## 절이 없는 part
// copy_error_part_code_fence: 닫히지 않은 코드 fence, 코드 안 :::보다 짧은 바깥 fence
// ----------------------------------------------------------------------------------------

export const copy_error_part_top_level = "must be at the top level of the document";
export const copy_error_part_container = "must be written as a ::: block";
export const copy_error_part_line = "must be written as a ::part[...] line";
export const copy_error_part_plain_title = "needs a plain-text title";
export const copy_error_part_empty_title = "needs a non-empty title";
export const copy_error_part_body = "needs content";
export const copy_error_part_attribute = "does not support the attribute";
export const copy_error_part_attribute_syntax = "has malformed attributes; only details takes a bare {open}";
export const copy_error_part_fence = "needs a closing fence at least as long as the opening one";
export const copy_error_part_heading = "cannot contain # or ## headings";
export const copy_error_part_section = "needs a ## section before the next part or the end of the document";
export const copy_error_part_code_fence = "needs closed code fences and an outer fence longer than any ::: in its code";

// ----------------------------------------------------------------------------------------
// 미등록 날짜 상태 문구 경고
// ----------------------------------------------------------------------------------------

export const copy_warn_unknown_status = "Status phrase not in the configuration";

// ----------------------------------------------------------------------------------------
// 문서 제목 아래 날짜 라벨
//
// 페이지 언어의 기본 하위 태그가 ko면 한국어, 그 밖은 영어
// ----------------------------------------------------------------------------------------

export const copy_doc_dates = {
    en: {created: "Created", revised: "Revised"},
    ko: {created: "작성일", revised: "수정일"},
} as const;
