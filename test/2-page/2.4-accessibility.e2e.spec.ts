import AxeBuilder from "@axe-core/playwright";
import {expect} from "@playwright/test";
import {test} from "@test/_fixture/site";

// 이 파일의 페이지 주소 기준은 docsSite
test.use({
    baseURL: async ({docsSite}, use) => {
        await use(docsSite);
    },
});

/**
 * 레이아웃마다 사이트맵 페이지 분담 검사 수
 *
 *   - 검사 하나의 전체 페이지 순회는 그 검사가 실행 시간 결정
 */
const page_shards = 4;

/**
 * 공식 문서 공개 페이지의 자동 접근성 검사(content/public, src/component) 검증
 *
 *   - axe 기본 규칙 전체, WCAG와 권장 사례 포함
 *   - 레이아웃마다 page_shards개 검사가 페이지 분담, 워커 병렬 실행
 */
test.describe("접근성", () => {
    for (const layout of [
        {caseId: "ACC-001", name: "데스크톱 1600px", options: {viewport: {width: 1600, height: 1000}}},
        {caseId: "ACC-002", name: "데스크톱 1600px 어두운 테마", options: {viewport: {width: 1600, height: 1000}, colorScheme: "dark" as const}},
        {caseId: "ACC-003", name: "휴대폰 390px 터치", options: {viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}},
    ]) {
        test.describe(`레이아웃 ${layout.name}`, () => {
            test.use(layout.options);

            for (let shard = 0; shard < page_shards; shard += 1) {
                test(`[${layout.caseId}] 사이트맵의 공개 페이지 ${shard + 1}/${page_shards} 묶음은 axe 위반이 없다`, {tag: "@high"}, async ({page}) => {
                    // CI 러너에서 묶음 하나의 열 페이지 검사는 기본 30초 초과, 한도 세 배
                    test.slow();

                    /**
                     * GIVEN
                     * 공식 문서 사이트맵에 담긴 경로와 이 검사가 맡은 묶음
                     */
                    const sitemap = await (await page.request.get("/sitemap.xml")).text();
                    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
                    const pages = paths.filter((_path, index) => index % page_shards === shard);

                    await test.step("사이트맵은 홈과 공개 문서를 담고 이 묶음은 비지 않는다", async () => {
                        /**
                         * GIVEN
                         * 사이트맵에서 읽은 경로
                         */

                        /**
                         * WHEN
                         * 홈을 제외한 문서 경로 선별
                         */
                        const documents = paths.filter((path) => path !== "/");

                        /**
                         * THEN
                         * 홈과 하나 이상의 문서 경로, 이 묶음에도 페이지가 있음
                         */
                        expect(paths).toContain("/");
                        expect(documents.length).toBeGreaterThan(0);
                        expect(pages.length).toBeGreaterThan(0);
                    });

                    for (const path of pages) {
                        await test.step(`${path} 페이지는 axe 위반이 없다`, async () => {
                            /**
                             * GIVEN
                             * 사이트맵의 공개 페이지 경로
                             */

                            /**
                             * WHEN
                             * 다이어그램과 글꼴 요청이 끝난 페이지의 axe 검사
                             */
                            await page.goto(path);
                            await page.waitForLoadState("networkidle");

                            const result = await new AxeBuilder({page}).analyze();

                            /**
                             * THEN
                             * 위반 규칙과 대상 요소 없음. 묶음의 모든 페이지 결과 일괄 보고
                             */
                            expect
                                .soft(result.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`))
                                .toStrictEqual([]);
                        });
                    }
                });
            }
        });
    }
});
