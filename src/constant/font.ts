// ----------------------------------------------------------------------------------------
// 패키지 내장 글꼴 CSS
//
// 경로는 패키지 기준
// OFL 라이선스는 각 글꼴 폴더
// CLI에서 @font-face와 자원 생성
// font-family는 token.css 소유
//
// font_mono_css: 본문 영문, 코드, 흐름도 글꼴, Regular와 SemiBold 두 파일
// font_body_css: 본문 한글 글꼴, IBM Plex Sans KR Regular와 SemiBold의 한글 unicode-range
// font_brand_css: 사이트 이름 글꼴, Architects Daughter Regular의 라틴 서브셋
// ----------------------------------------------------------------------------------------
export const font_mono_css = "src/asset/font/monoplex-kr/monoplex-kr.css";
export const font_body_css = "src/asset/font/ibm-plex-sans-kr/ibm-plex-sans-kr.css";
export const font_brand_css = "src/asset/font/architects-daughter/architects-daughter.css";

// ----------------------------------------------------------------------------------------
// 글꼴 파일 출력 정책
//
// font_display_strategy: 늦게 받은 글꼴로 이미 보이는 대체 글꼴 교체 없음
// font_hash_length: 글꼴 파일 내용의 URL 지문 길이, 파일 변경 시 이전 캐시와 분리
// font_cache_control: 내용 지문이 붙은 글꼴만 장기 재사용, CSS와 브라우저 스크립트 제외
// ----------------------------------------------------------------------------------------
export const font_display_strategy = "optional";
export const font_hash_length = 12;
export const font_cache_control = "public, max-age=31536000, immutable";
