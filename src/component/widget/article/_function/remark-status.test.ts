import type {Root} from "mdast";
import {VFile} from "vfile";
import {describe, expect, test} from "vitest";
import {remarkStatus} from "@/component/widget/article/_function/remark-status";

// ----------------------------------------------------------------------------------------
// 상태 표지 변환(src/component/widget/article/_function/remark-status.ts) 검증
// ----------------------------------------------------------------------------------------
describe("상태 표지", () => {
    describe("표지 종류", () => {
        test.each([
            {kind: "verified", phrase: "Done"},
            {kind: "unverified", phrase: "Needs answer"},
            {kind: "blocked", phrase: "Blocked"},
            {kind: "neutral", phrase: "Per Figma"},
        ] as const)("$kind 종류의 문구는 같은 이름의 표지 class 를 단다", (scenario) => {
            const tree: Root = {type: "root", children: [{type: "paragraph", children: [{type: "text", value: `Stage ${scenario.phrase} now`}]}]};

            remarkStatus({status: [{phrase: scenario.phrase, kind: scenario.kind}]})(tree, new VFile({path: "/docs/public/a.md"}));

            expect(tree).toHaveProperty("children.0.children.1.value", `<span class="wg_article__pill wg_article__pill--${scenario.kind}">${scenario.phrase}</span>`);
        });
    });
});
