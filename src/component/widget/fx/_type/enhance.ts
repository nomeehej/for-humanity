import type {FxCopy} from "@/component/widget/fx/_type/copy";

// ----------------------------------------------------------------------------------------
// 그림 하나를 살리는 입력
//
// root: data-fx를 가진 .fx 상자
// copy: 페이지 언어의 조작부 문구
// signal: 위젯 해제 신호, abort에서 이벤트 구독 해제와 DOM 복원
// ----------------------------------------------------------------------------------------
interface FxEnhanceParams {
    root: HTMLElement;
    copy: FxCopy;
    signal: AbortSignal;
}

// ----------------------------------------------------------------------------------------
// 종류별 enhance
//
// 되돌리기는 signal의 abort 이벤트에서 처리
// ----------------------------------------------------------------------------------------
export type FxEnhance = (params: FxEnhanceParams) => void;
