import {mkdir, symlink, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {test} from "@test/_fixture/temp-root";
import {describe, expect} from "vitest";
import {readProject} from "@/app/_function/read-project";

describe("프로젝트 문서 루트", () => {
    describe("예약 폴더를 가리키는 심볼릭 링크", () => {
        for (const directory of ["dist", "dist-private", ".git", "node_modules"]) {
            test(`문서 루트가 심볼릭 링크로 ${directory} 안의 폴더를 가리키면 거부한다`, async ({root}) => {
                await mkdir(join(root, directory, "notes"), {recursive: true});
                await symlink(join(root, directory, "notes"), join(root, "notes"), "junction");
                await writeFile(join(root, "for-humanity.config.mjs"), 'export default {content: {root: "notes"}};');

                const result = readProject(root);

                await expect(result).rejects.toThrow("content root cannot be inside");
            });
        }
    });
});
