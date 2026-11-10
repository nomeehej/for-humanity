// ----------------------------------------------------------------------------------------
// 브라우저의 이전 스크롤 위치 복원 문서 진입
//
// 진입 종류는 새로고침, 뒤로가기, 앞으로가기
// ----------------------------------------------------------------------------------------
export const isRestoringNavigation = (): boolean => {
    const navigation = performance.getEntriesByType("navigation")[0];

    return navigation instanceof PerformanceNavigationTiming && (navigation.type === "reload" || navigation.type === "back_forward");
};
