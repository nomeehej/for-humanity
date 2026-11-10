import {describe, expect, expectTypeOf, test} from "vitest";
import {type SiteConfig, siteConfigSchema} from "@/type/site-config";

describe("사이트 설정", () => {
    describe("기본값과 공개 입력", () => {
        test("상태 이미지는 공개 설정에서 SVG 경로를 받고 영상 형식은 거부한다", () => {
            const input = {statusImage: "asset/face.svg"} satisfies SiteConfig;

            const result = siteConfigSchema.parse(input);
            const invalid = siteConfigSchema.safeParse({statusImage: "asset/face.mov"});

            expect(result.statusImage).toBe("asset/face.svg");
            expect(invalid.success).toBe(false);
        });

        test("상태 표지 종류는 blocked 와 neutral 도 받고 그 밖의 이름은 거부한다", () => {
            const input = {
                status: [
                    {phrase: "Done", kind: "verified", date: true},
                    {phrase: "Needs answer", kind: "unverified"},
                    {phrase: "Blocked", kind: "blocked"},
                    {phrase: "Kept", kind: "neutral", date: true},
                ],
            } satisfies SiteConfig;

            const result = siteConfigSchema.parse(input);
            const invalid = siteConfigSchema.safeParse({status: [{phrase: "Danger", kind: "danger"}]});

            expect(result.status.map((item) => item.kind)).toStrictEqual(["verified", "unverified", "blocked", "neutral"]);
            expect(invalid.success).toBe(false);
        });

        test("참조 접두는 대문자 1~3자이고 색을 생략하면 gray 이며 중복은 거부한다", () => {
            const input = {refs: [{prefix: "Q", color: "violet"}, {prefix: "BE"}]} satisfies SiteConfig;

            const result = siteConfigSchema.parse(input);
            const lowercase = siteConfigSchema.safeParse({refs: [{prefix: "q"}]});
            const duplicate = siteConfigSchema.safeParse({refs: [{prefix: "Q"}, {prefix: "Q", color: "blue"}]});

            expect(result.refs).toStrictEqual([
                {prefix: "Q", color: "violet"},
                {prefix: "BE", color: "gray"},
            ]);
            expect(lowercase.success).toBe(false);
            expect(duplicate.success).toBe(false);
        });

        test("설정을 생략하면 기본 이름, 포트, 탐색 순서를 적용한다", () => {
            const input = {} satisfies SiteConfig;

            const result = siteConfigSchema.parse(input);

            expect(result).toStrictEqual({
                content: {root: "content", public: "public", private: "private"},
                title: "for humanity",
                lang: "ko",
                locales: [],
                basePath: "/",
                port: 4321,
                host: "localhost",
                cursorFace: false,
                linkTarget: "new-tab",
                navigation: [],
                status: [
                    {phrase: "확인됨", kind: "verified", date: true},
                    {phrase: "확인되지 않았다", kind: "unverified"},
                ],
                refs: [],
            });
        });

        test.each([
            {url: "https://docs.example.org/", expected: "https://docs.example.org"},
            {url: "http://localhost:4321", expected: "http://localhost:4321"},
        ])("공개 주소 $url 입력은 루트 주소로 정규화한다", (scenario) => {
            const result = siteConfigSchema.parse({url: scenario.url});

            expect(result.url).toBe(scenario.expected);
        });

        test("공개 입력은 단일 묶음과 중첩 경로를 함께 허용한다", () => {
            const input = {port: 4322, cursorFace: true, navigation: [" Guide ", ["Projects", "Research"]], status: []} satisfies SiteConfig;

            const result = siteConfigSchema.parse(input);

            expect(result).toStrictEqual({
                content: {root: "content", public: "public", private: "private"},
                title: "for humanity",
                lang: "ko",
                locales: [],
                basePath: "/",
                port: 4322,
                host: "localhost",
                cursorFace: true,
                linkTarget: "new-tab",
                navigation: [["Guide"], ["Projects", "Research"]],
                status: [],
                refs: [],
            });

            expectTypeOf<NonNullable<SiteConfig["navigation"]>[number]>().toEqualTypeOf<string | string[]>();
        });

        test.each([
            {input: "/", expected: "/"},
            {input: "/agent-conventions", expected: "/agent-conventions/"},
            {input: "/uoo/", expected: "/uoo/"},
            {input: "/projects/docs.v2/", expected: "/projects/docs.v2/"},
        ])("배포 경로 $input 입력은 끝 슬래시를 포함한다", (scenario) => {
            expect(siteConfigSchema.parse({basePath: scenario.input}).basePath).toBe(scenario.expected);
        });

        test.each(["", "docs", "//example.org/", "/docs//guide/", "/./", "/docs/../", "/docs?x=1", "/docs#top", "/docs\\guide", "/%2e%2e/", "/docs path/"])(
            "잘못된 배포 경로 %s는 거부한다",
            (basePath) => {
                expect(siteConfigSchema.safeParse({basePath}).success).toBe(false);
            },
        );

        test.each([
            {name: "0 포트", input: {port: 0}},
            {name: "포트 상한 초과", input: {port: 65536}},
            {name: "소수 포트", input: {port: 4321.5}},
            {name: "문자열 포트", input: {port: "4321"}},
            {name: "문자열 커서 설정", input: {cursorFace: "true"}},
            {name: "지원하지 않는 링크 자리", input: {linkTarget: "popup"}},
            ...[
                "",
                "/",
                "file:///docs",
                "ftp://docs.example.org",
                "https://user:password@docs.example.org",
                "https://docs.example.org/docs/",
                "https://docs.example.org/?q=guide",
                "https://docs.example.org/#guide",
            ].map((url) => ({name: `공개 주소 "${url}"`, input: {url}})),
            {name: "언어 태그가 아닌 lang", input: {lang: "Korean language"}},
            {name: "미리보기 서비스가 표시하지 않는 SVG image", input: {image: "asset/preview.svg"}},
            {name: "중복 탐색 경로", input: {navigation: ["Guide", [" Guide "]]}},
            {name: "빈 탐색 경로", input: {navigation: [["Projects", ""]]}},
            {name: "빈 상태 문구", input: {status: [{phrase: " ", kind: "verified"}]}},
            {name: "지원하지 않는 상태", input: {status: [{phrase: "확인", kind: "unknown"}]}},
        ])("$name 입력은 거부한다", (scenario) => {
            const result = siteConfigSchema.safeParse(scenario.input);

            expect(result.success).toBe(false);
        });
    });

    describe("문서 경로", () => {
        test("문서 경로를 부분 지정하면 나머지는 기본 구조를 유지한다", () => {
            const input = {content: {root: "knowledge", private: "internal"}};

            const result = siteConfigSchema.parse(input);

            expect(result.content).toStrictEqual({root: "knowledge", public: "public", private: "internal"});
        });

        test.each([
            {root: "../outside"},
            {root: "/absolute"},
            {root: "C:\\content"},
            {public: "."},
            {public: ""},
            {public: "../outside"},
            {public: "dist"},
            {private: "dist-private"},
            {public: "same", private: "same"},
            {public: "guide", private: "guide/internal"},
            {public: "notes/public", private: "notes"},
            {public: "PUBLIC", private: "public"},
            {private: "node_modules"},
            {private: "folder/.git"},
            {public: "guide?draft"},
        ])("문서 범위를 모호하게 만드는 경로 %j는 거부한다", (content) => {
            const result = siteConfigSchema.safeParse({content});

            expect(result.success).toBe(false);
        });
    });

    describe("서버 수신 주소", () => {
        test.each([true, false, "0.0.0.0", "127.0.0.1", "::1", "localhost", "dev.example.test"])("host %s 입력은 수신 설정으로 보존한다", (host) => {
            const input = {host} satisfies SiteConfig;

            const result = siteConfigSchema.parse(input);

            expect(result.host).toBe(host);
        });

        test.each(["", "   ", "http://localhost", "localhost:9999", "/tmp/server.sock", 9999])("host %s 입력은 잘못된 주소로 거부한다", (host) => {
            const input = {host};

            const result = siteConfigSchema.safeParse(input);

            expect(result.success).toBe(false);
        });
    });

    describe("번역 언어", () => {
        test("locales는 설정 순서의 언어 목록으로 정규화하고 대문자와 예약 이름 키를 거부한다", () => {
            const input = {locales: {ko: {description: "한국어 안내"}, "zh-hans": {}}} satisfies SiteConfig;
            const invalidCodes = ["KO", "private", "_fh", "404.html", "en/us", "k"];

            const result = siteConfigSchema.parse(input);
            const invalid = invalidCodes.map((code) => siteConfigSchema.safeParse({locales: {[code]: {}}}).success);

            expect(result.locales).toStrictEqual([
                {code: "ko", description: "한국어 안내"},
                {code: "zh-hans", description: undefined},
            ]);
            expect(invalid).toStrictEqual(invalidCodes.map(() => false));
        });
    });
});
