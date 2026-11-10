import type {FxCopy} from "@/component/widget/fx-controls/_type/copy";

// ----------------------------------------------------------------------------------------
// 그림 하나의 enhance 입력
//
// root: data-fx 속성이 있는 .fx 상자
// copy: 페이지 언어의 조작부 문구
// signal: 위젯 해제 신호, abort에서 이벤트 구독 해제와 DOM 복원
// ----------------------------------------------------------------------------------------
interface FxEnhanceParams {
    root: HTMLElement;
    copy: FxCopy;
    signal: AbortSignal;
}

// ----------------------------------------------------------------------------------------
// 종류별 enhance 함수
//
// 복원은 signal의 abort 이벤트에서 처리
// ----------------------------------------------------------------------------------------
export type FxEnhance = (params: FxEnhanceParams) => void;
