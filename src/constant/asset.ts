// ----------------------------------------------------------------------------------------
// 정적 빌드와 dev의 공통 자원 URL
//
// asset_dir: 문서 경로와 분리한 자원 폴더
// asset_style_path: 내용 지문이 붙는 번들 CSS의 기본 URL
// asset_font_dir: 자체 호스팅 글꼴 폴더
// asset_mermaid_dir: 자체 호스팅 Mermaid ESM과 지연 청크 폴더
// asset_not_found_path: 없는 문서의 정적 오류 화면
// asset_status_image_path: 내용 지문이 붙는 기본 상태 이미지 URL
// asset_media_dir: 문서가 참조한 그림, 영상, 소리, 첨부 자원의 예약 경로
// ----------------------------------------------------------------------------------------
export const asset_dir = "_fh";
export const asset_style_path = `/${asset_dir}/style.css`;
export const asset_font_dir = `/${asset_dir}/fonts`;
export const asset_mermaid_dir = `/${asset_dir}/mermaid`;
export const asset_favicon_path = "/favicon.svg";
export const asset_not_found_path = "/404.html";
export const asset_status_image_path = `/${asset_dir}/face-sad.svg`;
export const asset_media_dir = `/${asset_dir}/media`;
