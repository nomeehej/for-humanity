// ----------------------------------------------------------------------------------------
// 재생 단계 간격
//
// fx_interval_ms: 재생 중 단계마다 머무는 시간
// fx_first_interval_ms: 재생 클릭 뒤 첫 전환까지 시간, 보이던 장면 확인 완료로 단축
// ----------------------------------------------------------------------------------------
export const fx_interval_ms = 2000;
export const fx_first_interval_ms = 500;

// ----------------------------------------------------------------------------------------
// 실행 상자의 콘솔 출력 수집 기본 시간
//
// data-wait로 변경 가능
// ----------------------------------------------------------------------------------------
export const fx_run_wait_ms = 2000;

// ----------------------------------------------------------------------------------------
// 슬라이더 범위의 HTML 기본값
//
// fx_range_default_min: min 속성이 없을 때 적용
// fx_range_default_max: max 속성이 없을 때 적용
// ----------------------------------------------------------------------------------------
export const fx_range_default_min = 0;
export const fx_range_default_max = 100;

// ----------------------------------------------------------------------------------------
// 조작부 아이콘 이름
// ----------------------------------------------------------------------------------------
export type FxIcon = keyof typeof fx_icons;

// ----------------------------------------------------------------------------------------
// 16px 칸 기준 아이콘 도형
//
// 속성은 [이름, 값] 쌍
// 색은 currentColor, 버튼 글자색과 일치
// 둥근 모서리는 끝과 꺾인 곳에만 약하게 적용
// 삼각형은 시각상 가운데에 맞춰 오른쪽으로 약간 배치
// ----------------------------------------------------------------------------------------
export const fx_icons = {
    play: [
        {
            tag: "path",
            attributes: [
                ["d", "M5.6 4.2v7.6l6.1-3.8z"],
                ["fill", "currentColor"],
                ["stroke", "currentColor"],
                ["stroke-width", "1.4"],
                ["stroke-linejoin", "round"],
            ],
        },
    ],
    pause: [
        {
            tag: "rect",
            attributes: [
                ["x", "4.4"],
                ["y", "3.6"],
                ["width", "2.4"],
                ["height", "8.8"],
                ["rx", "0.7"],
                ["fill", "currentColor"],
            ],
        },
        {
            tag: "rect",
            attributes: [
                ["x", "9.2"],
                ["y", "3.6"],
                ["width", "2.4"],
                ["height", "8.8"],
                ["rx", "0.7"],
                ["fill", "currentColor"],
            ],
        },
    ],
    prev: [
        {
            tag: "path",
            attributes: [
                ["d", "M9.8 3.8 5.6 8l4.2 4.2"],
                ["fill", "none"],
                ["stroke", "currentColor"],
                ["stroke-width", "1.6"],
                ["stroke-linecap", "round"],
                ["stroke-linejoin", "round"],
            ],
        },
    ],
    next: [
        {
            tag: "path",
            attributes: [
                ["d", "M6.2 3.8 10.4 8l-4.2 4.2"],
                ["fill", "none"],
                ["stroke", "currentColor"],
                ["stroke-width", "1.6"],
                ["stroke-linecap", "round"],
                ["stroke-linejoin", "round"],
            ],
        },
    ],
} satisfies Record<string, {tag: "path" | "rect"; attributes: [string, string][]}[]>;
