// ----------------------------------------------------------------------------------------
// JavaScript 실행 전 적용할 소스 스타일
//
// 전역 기본값 뒤에 소유자 스타일 배치
// 그림 작성 어휘는 빌드와 같이 본문 스타일 뒤 배치
// 같은 특이도에서 본문 li 여백보다 우선
// ----------------------------------------------------------------------------------------
export const style_paths = [
    "/src/style/base.css",
    "/src/style/token.css",
    ...Object.keys(import.meta.glob(["/src/component/**/*.css", "/src/page/**/*.css"])),
    "/src/style/authoring/fx.css",
];
