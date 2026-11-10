/**
 * 기본 문서 루트와 공개 범위 폴더
 */
export const content_default = {root: "content", public: "public", private: "private"};

// ----------------------------------------------------------------------------------------
// 정적 출력 폴더
//
// 문서 루트 기준
//
// content_output_dir: 공개판 출력
// content_private_output_dir: 내부 문서 포함 내부판 출력
// ----------------------------------------------------------------------------------------
export const content_output_dir = "dist";
export const content_private_output_dir = "dist-private";

/**
 * 문서와 참조에서 제외하는 생성물, 저장소, 설치 폴더. 대소문자 무시
 */
export const content_reserved_dirs: readonly string[] = [content_output_dir, content_private_output_dir, ".git", "node_modules"];

/**
 * 내부 문서 URL의 첫 경로 조각. 문서 id 생성과 공개 문서의 링크 검사가 공유
 */
export const content_private_segment = "private";
