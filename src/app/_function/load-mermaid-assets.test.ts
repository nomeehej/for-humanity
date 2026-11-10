import {mkdir, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {test} from "@test/_fixture/temp-root";
import {describe, expect} from "vitest";
import {loadMermaidAssets} from "@/app/_function/load-mermaid-assets";

describe("다이어그램", () => {
    describe("패키지 자원", () => {
        test("진입 모듈, 공유 청크, 라이선스 고지가 같은 공개 경로에 등록된다", async ({root}) => {
            const directory = join(root, "dist/mermaid");
            const names = ["mermaid-HASH.js", "chunk-HASH.js", "THIRD-PARTY-NOTICES.txt"];

            await mkdir(directory, {recursive: true});
            await Promise.all(names.map((name) => writeFile(join(directory, name), name)));

            const result = loadMermaidAssets(root);

            expect(result.entry).toBe("/_fh/mermaid/mermaid-HASH.js");
            expect(result.files).toStrictEqual(new Map(names.map((name) => [`/_fh/mermaid/${name}`, join(directory, name)])));
        });

        test("진입 모듈이 없으면 빌드 안내가 포함된 오류가 발생한다", async ({root}) => {
            await mkdir(join(root, "dist/mermaid"), {recursive: true});
            await writeFile(join(root, "dist/mermaid/chunk-HASH.js"), "export {};");

            const result = () => {
                return loadMermaidAssets(root);
            };

            expect(result).toThrow(/Missing Mermaid browser entry.*pnpm build:kit/);
        });

        test("자원 폴더가 없어도 빌드 안내가 포함된 오류가 발생한다", ({root}) => {
            const result = () => {
                return loadMermaidAssets(root);
            };

            expect(result).toThrow(/Missing Mermaid browser entry.*pnpm build:kit/);
        });
    });
});
