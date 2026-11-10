import type {DocOutline} from "@/type/doc-outline";

// ----------------------------------------------------------------------------------------
// README 홈과 일반 문서가 공유하는 렌더링 결과
//
// html: 문서 머리와 본문을 포함한 HTML
// outline: 현재 문서의 독립 목차 입력
// ----------------------------------------------------------------------------------------
export interface DocContent {
    html: string;
    outline: DocOutline;
}
