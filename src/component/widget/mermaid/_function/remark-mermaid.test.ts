import type {Root} from "mdast";
import {describe, expect, test} from "vitest";
import {remarkMermaid} from "@/component/widget/mermaid/_function/remark-mermaid";

describe("다이어그램", () => {
    describe("원문 변환", () => {
        test("다이어그램 원문은 실행 가능한 HTML 없이 보존된다", () => {
            const tree: Root = {type: "root", children: [{type: "code", lang: "mermaid", value: 'treeView-beta\n한글 <script>alert("x")</script> & guide.md'}]};

            remarkMermaid({files: new Map()})(tree);

            expect(tree.children[0].type).toBe("html");
            expect(tree.children[0]).toHaveProperty("value", expect.stringContaining("한글 &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; guide.md"));
            expect(tree.children[0]).toHaveProperty("value", expect.stringContaining('class="mermaid__result" hidden'));
            expect(tree.children[0]).toHaveProperty("value", expect.stringContaining('role="status" hidden'));
            expect(tree.children[0]).toHaveProperty("value", expect.not.stringMatching(/<script>|<svg|data-mermaid-module=/));
        });

        test("일반 코드 블록은 다이어그램으로 변환되지 않는다", () => {
            const tree: Root = {type: "root", children: [{type: "code", lang: "text", value: "docs/\n└── guide.md"}]};

            remarkMermaid({files: new Map()})(tree);

            expect(tree.children).toStrictEqual([{type: "code", lang: "text", value: "docs/\n└── guide.md"}]);
        });

        test("다이어그램이 있으면 전체 모듈 그래프와 고지가 등록된다", () => {
            const tree: Root = {type: "root", children: [{type: "code", lang: "mermaid", value: "flowchart LR\n A --> B"}]};

            const assets = {
                entry: "/_fh/mermaid/mermaid-HASH.js",
                files: new Map([
                    ["/_fh/mermaid/mermaid-HASH.js", "/kit/mermaid-HASH.js"],
                    ["/_fh/mermaid/chunk-HASH.js", "/kit/chunk-HASH.js"],
                    ["/_fh/mermaid/THIRD-PARTY-NOTICES.txt", "/kit/THIRD-PARTY-NOTICES.txt"],
                ]),
            };

            const files = new Map([["/_fh/existing.css", "/kit/existing.css"]]);

            remarkMermaid({assets, files})(tree);

            expect(tree.children[0]).toHaveProperty("value", expect.stringContaining('data-mermaid-module="/_fh/mermaid/mermaid-HASH.js"'));
            expect(files).toStrictEqual(new Map([["/_fh/existing.css", "/kit/existing.css"], ...assets.files]));
        });

        test("다이어그램이 없으면 모듈 그래프가 등록되지 않는다", () => {
            const tree: Root = {type: "root", children: [{type: "paragraph", children: [{type: "text", value: "문서"}]}]};
            const assets = {entry: "/_fh/mermaid/mermaid-HASH.js", files: new Map([["/_fh/mermaid/mermaid-HASH.js", "/kit/mermaid-HASH.js"]])};
            const files = new Map<string, string>();

            remarkMermaid({assets, files})(tree);

            expect(files.size).toBe(0);
        });
    });
});
