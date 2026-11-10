import type {ContentLocale} from "@/type/content-locale";
import type {DocContent} from "@/type/doc-content";
import type {DocData} from "@/type/doc-data";

// ----------------------------------------------------------------------------------------
// Markdown 파일 하나의 렌더링 결과
//
// id: 문서 URL id, 확장자 제외 소문자 경로, 하위 폴더 포함, 번역 문서는 언어 코드 접두
// locale: 번역 문서의 언어 코드, 기본 언어 문서는 생략
// data: 검증된 머리말
// ancestors: 검증된 부모 문서 경로, 최상위부터 직접 부모까지, 자신은 제외
// ----------------------------------------------------------------------------------------
export interface Doc extends DocContent {
    id: string;
    locale?: ContentLocale["code"];
    data: DocData;
    ancestors: string[];
}
