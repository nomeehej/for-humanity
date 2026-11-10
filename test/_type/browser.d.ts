export {};

declare global {
    // ----------------------------------------------------------------------------------------
    // 브라우저 수명 검사에서 수집한 전역 이벤트 구독
    //
    // target: 구독 대상
    // type: 이벤트 이름
    // listener: 등록된 콜백
    // options: 캡처 여부 또는 구독 옵션
    // removed: 명시적 해제 여부
    // owned: 테스트 셸의 구독 여부
    // ----------------------------------------------------------------------------------------
    interface ShellListener {
        target: EventTarget;
        type: string;
        listener: EventListenerOrEventListenerObject | null;
        options?: boolean | AddEventListenerOptions;
        removed: boolean;
        owned: boolean;
    }

    // ----------------------------------------------------------------------------------------
    // 공개 제품 코드와 분리한 브라우저 검사 계약
    //
    // 갤러리 페이지와 spec이 공유
    //
    // diagramFixture: 다이어그램 위젯의 마운트와 해제 명령
    // diagramRender: 실제 Mermaid 렌더의 첫 응답을 지연하는 테스트 전용 제어
    // mermaidInjected: 잘못된 원문에 넣은 스크립트의 실행 흔적, 실행되지 않으면 없음
    // navigationFrames: 첫 프레임부터 수집한 두 스크롤 위치
    // readingFrames: 첫 프레임부터 수집한 본문 스크롤 위치
    // tocChanges: 목차 현재 항목의 변경 기록
    // shellFixture: 셸 마운트와 해제 명령
    // shellListeners: 전역 구독의 수명 기록
    // tableSortFixture: 표 정렬 위젯의 마운트와 해제 명령
    // fxFixture: 그림 위젯의 마운트와 해제 명령
    // fxEnhanced: 갤러리에서 마운트한 그림 위젯의 onEnhanced 호출 횟수
    // ----------------------------------------------------------------------------------------
    interface Window {
        diagramFixture: {mount: () => void; unmount: () => void};
        diagramRender: {waiting: boolean; release: () => void; completion: Promise<void>};
        mermaidInjected?: boolean;
        navigationFrames: {documents: number; outline: number}[];
        readingFrames: number[];
        tocChanges: string[];
        shellFixture: {mount: () => void; unmount: () => void};
        shellListeners: ShellListener[];
        tableSortFixture: {mount: () => void; unmount: () => void};
        fxFixture: {mount: () => void; unmount: () => void};
        fxEnhanced: number;
    }
}
