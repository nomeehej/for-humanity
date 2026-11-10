import type {ColorName} from "consola/utils";

// ----------------------------------------------------------------------------------------
// 안내와 대화형 질문이 공유하는 터미널 박스
//
// title: 테두리 위에 표시할 제목
// message: 줄바꿈, 색상 포함 본문
// columns: 실제 출력 터미널의 열 수
// color: 미지정 시 청록색 테두리
// ----------------------------------------------------------------------------------------
export interface InitPanelParams {
    title: string;
    message: string;
    columns?: number;
    color?: ColorName;
}
