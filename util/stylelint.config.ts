import type {Config} from "stylelint";

// ----------------------------------------------------------------------------------------
// CSS 컨벤션의 자동 검사
//
// 포맷은 Biome
// 의미, 역할, 접근성 판단은 수동 리뷰
// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
// 클래스 이름 검사
//
// 목록에 없는 라이브러리 클래스는 소유 클래스 문법 검사 대상
//
// library_class_prefixes: 이름을 정하지 않는 라이브러리 클래스의 접두사, Shiki의 코드 줄 표기
// own_class_pattern: 라이브러리 클래스와 그림 작성 어휘 통과, 나머지는
//   block__element--modifier 문법만 통과
// own_markup_patterns: 직접 작성한 마크업의 금지 선택자
// ----------------------------------------------------------------------------------------
const library_class_prefixes = ["shiki", "line", "highlighted", "diff", "has-", "error", "warning", "add", "remove"];

const own_class_pattern = [
    "^(?:",
    `(?:${library_class_prefixes.join("|")}).*`,
    "|",

    // 작성자가 쓰는 공개 이름 fx, fx__요소, fx--상태, fx-종류
    "fx(?:[-_].*)?",
    "|",

    // 레이어 이름 없는 block__element 또는 block__element--modifier
    "[a-z][a-zA-Z0-9]*__[a-z][a-zA-Z0-9]*(?:--[a-z][a-zA-Z0-9]*)?",
    ")$",
].join("");

const own_markup_patterns = [
    // 최상위 상태 선택자 금지
    /^\.[\w-]+:(hover|focus|focus-visible|focus-within|active|enabled|disabled|checked|visited)/,

    // 소유 마크업의 요소 선택자 금지
    // 생성 마크업은 이유 주석이 있는 예외
    /^&\s*[>+~]?\s*[a-z]/,
];

// ----------------------------------------------------------------------------------------
// 라이브러리 클래스의 최상위 선택과 직접 작성한 마크업의 금지 선택자
//
// 라이브러리 클래스는 소유 root 아래에서만 선택
// ----------------------------------------------------------------------------------------
const disallowed_selectors: [RegExp[], {splitList: true}] = [[...library_class_prefixes.map((prefix) => new RegExp(`^\\.${prefix}`)), ...own_markup_patterns], {splitList: true}];

export default {
    extends: ["stylelint-config-standard"],

    // 불필요한 disable 주석 검출, 예외 주석은 실제 위반에만 유지
    reportNeedlessDisables: true,

    // 외부 글꼴 CSS 제외
    ignoreFiles: ["src/asset/**/*.css"],
    rules: {
        // 줄마다 닫은 주석 상자 허용. 앞 줄이 주석이면 빈 줄 없이 연결
        "comment-empty-line-before": ["always", {except: ["first-nested"], ignore: ["after-comment", "stylelint-commands"]}],

        // @media 내부 클래스 깊이 0
        // 상태 중첩 1단계 허용
        "max-nesting-depth": [1, {ignoreAtRules: ["media", "supports", "container"]}],

        // 전역 keyframes 이름에 소유자 블록 이름 명시, 수정자 구분자와 혼동 방지
        "keyframes-name-pattern": "^[a-z][a-zA-Z0-9]*__[a-z][a-zA-Z0-9]*$",

        // 쉼표 목록 이후의 단독 중복 선언 포함
        "no-duplicate-selectors": [true, {disallowInList: true}],

        // !important: 전역 움직임 줄이기만 허용
        "declaration-no-important": true,

        // 지역 CSS 변수 선언 금지
        // var() 소비 허용
        "property-disallowed-list": ["/^--/"],

        // 소유 마크업의 상태는 수정자 클래스
        "selector-attribute-name-disallowed-list": [/^aria-/],
        "selector-class-pattern": own_class_pattern,
        "selector-disallowed-list": disallowed_selectors,
        "selector-max-id": 0,

        // 부정 선택자 대신 기본 블록
        "selector-pseudo-class-disallowed-list": ["not"],
    },
    overrides: [
        {
            // 전역 스타일과 그림 작성 어휘는 소유 클래스 문법 제외
            // 작성 어휘의 --fx-* 공개 변수 선언 허용
            files: ["src/style/**/*.css", "src/*.css"],
            rules: {
                "selector-class-pattern": null,
                "keyframes-name-pattern": null,
                "property-disallowed-list": null,

                // 움직임 줄이기의 전역 !important 예외
                "declaration-no-important": null,
            },
        },
        {
            // 그림 작성 어휘는 전역 !important 예외 밖
            // 소유 클래스 이름 사용 금지
            files: ["src/style/authoring/**/*.css"],
            rules: {
                "declaration-no-important": true,
            },
        },
        {
            // 전역 토큰의 --app-* 문법
            files: ["src/style/token.css"],
            rules: {
                "selector-class-pattern": null,
                "property-disallowed-list": null,

                // 컴포넌트 클래스의 선언은 소유 CSS에 한정
                "selector-disallowed-list": [/\.[a-z][a-zA-Z0-9]*__/],

                // var() 소비까지 검사
                // 외부 변수 소비 파일 제외
                "custom-property-pattern": "^app-[a-z0-9-]+$",
            },
        },
    ],
} satisfies Config;
