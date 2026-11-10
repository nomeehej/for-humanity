// ----------------------------------------------------------------------------------------
// 소유자가 없는 설정, 경로 검사와 로그의 문구
//
// 소유자 전용 문구는 소유자의 _constant/copy.ts
// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
// 사이트 제목의 기본값
//
// 사이드바와 탭에 표시
// ----------------------------------------------------------------------------------------
export const copy_site_title_default = "for humanity";

// ----------------------------------------------------------------------------------------
// 터미널 로그 접두사
// ----------------------------------------------------------------------------------------
export const copy_error_prefix = "for-humanity";

// ----------------------------------------------------------------------------------------
// 사이트 설정 항목 오류
//
// copy_error_site_url: 공개 사이트 URL의 하위 경로, 자격 증명, 쿼리, 해시
// copy_error_site_base_path: 배포 경로의 상대 주소, 경로 이동과 URL 예약 문자
// copy_error_site_lang: 문서 언어 설정의 잘못된 값
// copy_error_site_image: 링크 미리보기 이미지의 형식
// copy_error_status_image: 상태 화면 이미지의 형식
// copy_error_site_host: 서버 수신 주소의 잘못된 형식
// copy_error_navigation_clash: 탐색 순서에 같은 묶음 두 번 지정
// ----------------------------------------------------------------------------------------
export const copy_error_site_url = "url must be an HTTP(S) site root without credentials, a subpath, a query or a hash";
export const copy_error_site_base_path = "basePath must start with / and contain only URL-safe path segments without . or ..";
export const copy_error_site_lang = "lang must be a language tag such as ko or en-US";
export const copy_error_site_image = "image must be a PNG, JPEG, GIF or WebP file";
export const copy_error_status_image = "statusImage must be an SVG, PNG, JPEG, GIF, WebP or AVIF file";
export const copy_error_site_host = "host must be true, false, an IP address or a hostname without a protocol or port";
export const copy_error_navigation_clash = "Duplicate navigation groups";

// ----------------------------------------------------------------------------------------
// content 폴더 설정 오류
//
// copy_error_content_path: content 경로 설정의 프로젝트 밖, 예약 폴더
// copy_error_public_folder: 공개 문서 폴더의 content 루트 지정
// copy_error_private_folder: 내부 문서 폴더의 content 루트 지정
// copy_error_content_overlap: 공개, 내부 문서 폴더의 중복, 중첩
// ----------------------------------------------------------------------------------------
export const copy_error_content_path = "Use a relative path inside the project; dist, dist-private, node_modules and .git are not allowed";
export const copy_error_public_folder = "Public documents need their own subfolder";
export const copy_error_private_folder = "Private documents need their own subfolder";
export const copy_error_content_overlap = "Public and private document folders cannot be the same or nested";

// ----------------------------------------------------------------------------------------
// 로컬 참조, 문서 id 오류
//
// copy_error_reference_outside: 문서 범위 밖이나 예약 폴더로 향하는 참조
// copy_error_private_reference: 공개 문서의 내부 자료 참조
// copy_error_private_id: 공개 문서 id가 내부 문서 URL 접두사로 시작
// copy_error_markdown_outside: 공개, 내부 문서 폴더 밖의 Markdown 참조
// copy_error_url_encoding: 해석할 수 없는 퍼센트 인코딩이 포함된 로컬 참조
// ----------------------------------------------------------------------------------------
export const copy_error_reference_outside = "Reference outside the document scope";
export const copy_error_private_reference = "Public documents cannot reference private files";
export const copy_error_private_id = "The private URL prefix is reserved for internal documents";
export const copy_error_markdown_outside = "Markdown reference outside the public and private document folders";
export const copy_error_url_encoding = "Invalid percent-encoding";

// ----------------------------------------------------------------------------------------
// 링크 경고
//
// 빌드 계속
//
// copy_warn_broken_link: 없는 문서로 향하는 Markdown, 원시 HTML 링크
// copy_warn_broken_anchor: 없는 제목이나 id로 향하는 hash 링크
// ----------------------------------------------------------------------------------------
export const copy_warn_broken_link = "Link to a missing document";
export const copy_warn_broken_anchor = "Link to a missing heading";

// ----------------------------------------------------------------------------------------
// 참조 접두 형식, 중복 오류
// ----------------------------------------------------------------------------------------
export const copy_error_ref_prefix = "refs[].prefix must be 1 to 3 uppercase letters";
export const copy_error_ref_duplicate = "refs[].prefix must be unique";

// ----------------------------------------------------------------------------------------
// 번역 언어, 본문 링크 설정 오류
//
// copy_error_site_locale: 번역 언어 코드의 형식
// copy_error_site_link_target: 본문 링크 열림 위치 설정의 값
// copy_error_locale_id: 기본 언어 공개 문서 id가 번역 언어 접두사로 시작
// ----------------------------------------------------------------------------------------
export const copy_error_site_locale = "locales keys must be lowercase language tags such as ko or zh-hans";
export const copy_error_site_link_target = "linkTarget must be new-tab or same-tab";
export const copy_error_locale_id = "The locale URL prefix is reserved for translated documents";

// ----------------------------------------------------------------------------------------
// 문서 날짜 오류
//
// 두 문구 모두 앞에 항목 이름 추가
//
// copy_error_doc_revised: created보다 앞선 revised
// ----------------------------------------------------------------------------------------
export const copy_error_doc_date = "must be YYYY-MM or YYYY-MM-DD";
export const copy_error_doc_revised = "must not be earlier than created";
