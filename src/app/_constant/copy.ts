// ----------------------------------------------------------------------------------------
// 설정 오류
//
// copy_error_config: 검증 실패 시 항목 경로와 이유 추가
// ----------------------------------------------------------------------------------------
export const copy_error_config = "Invalid configuration";
export const copy_error_config_clash = "More than one config file";

// ----------------------------------------------------------------------------------------
// 문서 폴더와 content 루트 오류
//
// copy_error_home_clash: 대소문자만 다른 README 중복
// copy_hint_content_layout: 공개 문서 폴더 누락 시 확인할 설정 안내
// copy_error_content_folder: symlink이거나 content 밖에 있는 문서 폴더
// ----------------------------------------------------------------------------------------
export const copy_error_home_clash = "More than one home README";
export const copy_error_content_root_outside = "The content root must be inside the project";
export const copy_error_content_root_reserved = "The content root cannot be inside dist, dist-private, .git or node_modules";
export const copy_error_content_root_missing = "Content root not found";
export const copy_error_public_missing = "Public document folder not found";
export const copy_hint_content_layout = "Check the content/public layout or the content setting";
export const copy_error_content_folder = "Document folders must be real folders inside the content root";

// ----------------------------------------------------------------------------------------
// 문서 frontmatter, id, 부모 참조 오류
//
// copy_error_frontmatter: 검증 실패 시 파일과 항목 추가
// copy_error_doc_id: 빈 id, 예약 경로, URL 예약 문자
// copy_error_doc_id_clash: 확장자, 대소문자 정규화 후 문서 경로 중복
// copy_error_doc_parent_missing: 누락되거나 홈을 가리키는 부모 문서 참조
// copy_error_doc_parent_cycle: 자기 참조 또는 순환하는 문서 부모 경로
// copy_error_doc_parent_group: 분류 경로가 다른 문서 사이의 부모 참조
// ----------------------------------------------------------------------------------------
export const copy_error_frontmatter = "Invalid frontmatter";
export const copy_error_doc_id = "Path cannot be used as a document id";
export const copy_error_doc_id_clash = "Duplicate document ids";
export const copy_error_doc_parent_missing = "Parent document not found";
export const copy_error_doc_parent_cycle = "Circular document parents";
export const copy_error_doc_parent_group = "Parent document is in another group";

// ----------------------------------------------------------------------------------------
// 문서 링크, 자원, 스니펫 오류
//
// copy_error_private_url: 공개 문서 원시 HTML의 내부 문서 URL 링크
// copy_error_asset: 문서가 참조한 로컬 자원의 경로, 형식
// copy_error_snippet: `<<<`로 불러온 코드 스니펫의 경로, 파일, region
// ----------------------------------------------------------------------------------------
export const copy_error_private_url = "Public documents cannot link to private URLs";
export const copy_error_asset = "Invalid asset";
export const copy_error_snippet = "Invalid code snippet";

// ----------------------------------------------------------------------------------------
// 로컬 참조 오류의 이유
//
// copy_error_not_file: 폴더 등 일반 파일이 아닌 대상
// ----------------------------------------------------------------------------------------
export const copy_error_file_missing = "file not found";
export const copy_error_not_file = "not a regular file";

// ----------------------------------------------------------------------------------------
// 이미지, 영상, 소리 자원 오류의 이유
//
// copy_error_media_format: video, audio, source에서 지원하지 않는 형식
// ----------------------------------------------------------------------------------------
export const copy_error_image_format = "unsupported image format";
export const copy_error_media_format = "unsupported video or audio format";

// ----------------------------------------------------------------------------------------
// 상태 화면 문구
//
// copy_not_found_title: 없는 문서 화면의 제목
// copy_not_found_description: 없는 문서 화면의 원인과 복귀 안내
// copy_status_home: 홈 복귀 링크
// ----------------------------------------------------------------------------------------
export const copy_not_found_title = "Page not found";
export const copy_not_found_description = "This page may have moved or no longer exists. Find your way back from the home page.";
export const copy_status_home = "Back to home";

// ----------------------------------------------------------------------------------------
// 자막, 삽입 문서 자원 오류의 이유
//
// copy_error_track_format: track에서 WebVTT가 아닌 형식
// copy_error_embed_format: embed, object에서 PDF와 이미지가 아닌 형식
// ----------------------------------------------------------------------------------------
export const copy_error_track_format = "unsupported text track format";
export const copy_error_embed_format = "unsupported embedded file format";

// ----------------------------------------------------------------------------------------
// 배포 형식이 아닌 로컬 파일 링크 경고
//
// 빌드 계속
// ----------------------------------------------------------------------------------------
export const copy_warn_unpublished_file = "Link to a local file that is not published";

// ----------------------------------------------------------------------------------------
// 스니펫 오류의 이유
//
// copy_error_region_open: 파일 끝까지 닫히지 않은 region
// ----------------------------------------------------------------------------------------
export const copy_error_region_missing = "region not found";
export const copy_error_region_open = "region not closed";

// ----------------------------------------------------------------------------------------
// 패키지 빌드 전 Mermaid 진입 모듈 누락 오류
// ----------------------------------------------------------------------------------------
export const copy_error_mermaid_entry = "Missing Mermaid browser entry. Run pnpm build:kit before using the CLI";

// ----------------------------------------------------------------------------------------
// 다른 언어 문서 사이의 부모 참조 오류
// ----------------------------------------------------------------------------------------
export const copy_error_doc_parent_locale = "Parent document is in another language";
