// ----------------------------------------------------------------------------------------
// 모든 페이지가 공유하는 HTML 머리 자원
//
// stylePaths: 첫 화면 전에 적용할 스타일시트 URL, 배열 순서로 우선순위 유지
// browser: 동기 배포 번들 또는 개발 실행기의 모듈 진입점
// browser.kind: 본문 앞 동기 실행용 inline, 개발 서버 모듈 수신용 module
// browser.code: 인라인 IIFE 내용
// browser.path: 브라우저에서 요청할 진입 URL
// fontCss: 내장 @font-face, head의 style 내용
// preload: 선요청 글꼴 URL, 대상은 사이트 이름, 본문 공통 조각, 코드
// image: 링크 미리보기 이미지의 절대 URL, 공개 주소와 image 설정 지정 시에만 존재
// noindex: 모든 페이지의 검색 색인 제외 표시, 내부판 빌드만 지정
// ----------------------------------------------------------------------------------------
export interface SiteAssets {
    stylePaths: string[];
    browser: {kind: "inline"; code: string} | {kind: "module"; path: string};
    fontCss: string;
    preload: string[];
    image?: string;
    noindex?: boolean;
}
