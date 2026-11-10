// ----------------------------------------------------------------------------------------
// 조작부 문구 한 벌
//
// play: 재생 아이콘 버튼의 이름
// pause: 멈춤 아이콘 버튼의 이름
// previous: 이전 단계 아이콘 버튼의 이름
// next: 다음 단계 아이콘 버튼의 이름
// step: 스크러버의 이름
// run: 실행 상자의 실행 버튼
// edit: 실행 상자의 코드 입력 열기
// close: 실행 상자의 코드 입력 닫기
// reset: 실행 상자의 처음 코드로 되돌리기
// code: 코드 입력 상자의 이름
// empty: 출력이 비었을 때의 안내
// ----------------------------------------------------------------------------------------
export interface FxCopy {
    play: string;
    pause: string;
    previous: string;
    next: string;
    step: string;
    run: string;
    edit: string;
    close: string;
    reset: string;
    code: string;
    empty: string;
}
