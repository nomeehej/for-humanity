// ----------------------------------------------------------------------------------------
// CLI 도움말 설명
//
// copy_dir_description: 프로젝트 폴더 인자
// ----------------------------------------------------------------------------------------
export const copy_tool_description = "Develop, build and preview a Markdown documentation site";
export const copy_dev_description = "Start a development server that reflects document changes";
export const copy_build_description = "Build the public documentation site into content/dist";
export const copy_preview_description = "Preview the built static site locally";
export const copy_dir_description = "Project folder";

// ----------------------------------------------------------------------------------------
// 내부판 문구
//
// copy_private_description: build의 내부판 출력 옵션 설명
// copy_preview_private_description: preview의 내부판 옵션 설명
// copy_private_notice: 내부판 빌드 성공 로그 뒤 배포 주의
// ----------------------------------------------------------------------------------------
export const copy_private_description = "Include private documents and write to dist-private instead of dist";
export const copy_preview_private_description = "Preview dist-private, the build output that includes private documents";
export const copy_private_notice = "This output includes private documents. Deploy it only behind access control";

// ----------------------------------------------------------------------------------------
// 서버 수신 주소 CLI 옵션 설명
// ----------------------------------------------------------------------------------------
export const copy_host_description = "Listen on this address; omit the value to allow LAN connections";

// ----------------------------------------------------------------------------------------
// CLI 입력 오류 문구
//
// copy_error_option: 미지원 옵션, 옵션 이름 추가
// copy_hint_help: 사용법 확인 안내, 입력 오류 뒤 표시
// copy_error_project_args: 프로젝트 폴더 인자가 둘 이상
// ----------------------------------------------------------------------------------------
export const copy_error_option = "Unknown option";
export const copy_hint_help = "Run --help for usage";
export const copy_error_project_args = "Specify only one project folder";
