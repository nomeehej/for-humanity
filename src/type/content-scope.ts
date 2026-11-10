import type {ContentLocale} from "@/type/content-locale";

// ----------------------------------------------------------------------------------------
// 문서 처리 한 회차의 절대 경로와 공개 범위
//
// root: 홈과 공용 자원 포함 문서 루트
// publicRoot: URL 루트에 대응하는 공개 문서 폴더
// privateRoot: /private/ URL에 대응하는 내부 문서 폴더
// includePrivate: 개발 실행의 내부 문서 포함 여부
// locales: 번역 언어별 홈과 공개 문서 폴더, 설정 순서
// ----------------------------------------------------------------------------------------
export interface ContentScope {
    root: string;
    publicRoot: string;
    privateRoot: string;
    includePrivate: boolean;
    locales: ContentLocale[];
}
