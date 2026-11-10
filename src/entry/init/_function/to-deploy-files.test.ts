import {spawnSync} from "node:child_process";
import {mkdir, readFile, stat, writeFile} from "node:fs/promises";
import {dirname, join} from "node:path";
import {test} from "@test/_fixture/temp-root";
import {describe, expect} from "vitest";
import {parse, parseDocument} from "yaml";
import {toDeployFiles} from "@/entry/init/_function/to-deploy-files";

describe("초기화 배포 파일", () => {
    test("배포 대상이 없으면 파일을 추가하지 않는다", async () => {
        const files = await toDeployFiles({title: "Guide", content: "content", lang: "en", deploy: "none", branch: "main", manager: "npm"});

        expect(files).toEqual([]);
    });

    describe("GitHub Pages", () => {
        test.each(["npm", "pnpm"] as const)("%s 명령과 기존 액션 버전으로 사용자 문서 폴더를 배포한다", async (manager) => {
            const template = parseDocument(await readFile(new URL("./template/github-pages.yml", import.meta.resolve("for-humanity/package.json")), "utf8"));

            const files = await toDeployFiles({title: "Guide", content: "docs/team handbook", lang: "en", deploy: "github-pages", branch: "master", manager});

            expect(files).toHaveLength(1);
            expect(files[0].path).toBe(".github/workflows/docs.yml");
            const workflow: unknown = parse(files[0].content);
            expect(workflow).toEqual({
                name: "Documentation",
                on: {push: {branches: ["master"]}, workflow_dispatch: null},
                permissions: {contents: "read"},
                concurrency: {group: "github-pages", "cancel-in-progress": false},
                jobs: {
                    build: {
                        "runs-on": "ubuntu-latest",
                        "timeout-minutes": 10,
                        steps: [
                            {uses: template.getIn(["jobs", "build", "steps", 0, "uses"])},
                            {
                                uses: template.getIn(["jobs", "build", "steps", 1, "uses"]),
                                with: manager === "npm" ? {"node-version": "22", cache: "npm"} : {"node-version": "22", "package-manager-cache": false},
                            },
                            ...(manager === "pnpm" ? [{uses: template.getIn(["jobs", "build", "steps", 2, "uses"]), with: {cache: false}}] : []),
                            {run: manager === "npm" ? "npm ci" : "pnpm install --frozen-lockfile"},
                            {run: manager === "npm" ? "npm run docs:build" : "pnpm docs:build"},
                            {uses: template.getIn(["jobs", "build", "steps", 5, "uses"]), with: {path: "docs/team handbook/dist"}},
                        ],
                    },
                    deploy: {
                        needs: "build",
                        "runs-on": "ubuntu-latest",
                        "timeout-minutes": 10,
                        permissions: {pages: "write", "id-token": "write"},
                        environment: {name: "github-pages", url: template.getIn(["jobs", "deploy", "environment", "url"])},
                        steps: [{name: "Deploy documentation", id: "deployment", uses: template.getIn(["jobs", "deploy", "steps", 0, "uses"])}],
                    },
                },
            });
        });

        test("프로젝트 루트 문서는 dist 경로로 업로드한다", async () => {
            const files = await toDeployFiles({title: "Guide", content: ".", lang: "en", deploy: "github-pages", branch: "main", manager: "pnpm"});

            expect(parseDocument(files[0].content).getIn(["jobs", "build", "steps", 5, "with", "path"])).toBe("dist");
        });

        test.each(["on", "true", "123"])("YAML 의미가 있는 %s 브랜치도 문자열로 유지한다", async (branch) => {
            const files = await toDeployFiles({title: "Guide", content: "content", lang: "en", deploy: "github-pages", branch, manager: "npm"});

            const workflow: unknown = parse(files[0].content);
            expect(workflow).toMatchObject({on: {push: {branches: [branch]}}});
        });

        test.each([
            ["!release#docs", "\\!release#docs"],
            ["release+docs", "release\\+docs"],
        ])("필터 의미가 있는 %s 브랜치는 정확한 이름으로 배포한다", async (branch, filter) => {
            const files = await toDeployFiles({title: "Guide", content: "content", lang: "en", deploy: "github-pages", branch, manager: "npm"});
            const workflow: unknown = parse(files[0].content);

            expect(workflow).toMatchObject({on: {push: {branches: [filter]}}});
        });
    });

    describe("Cloudflare Pages", () => {
        test("사이트 이름에 의존하지 않는 404 페이지와 준비 스크립트를 제공한다", async () => {
            const files = await toDeployFiles({title: "Team handbook", content: "content", lang: "en", deploy: "cloudflare-pages", branch: "main", manager: "npm"});

            expect(files.map((file) => file.path)).toEqual([".cloudflare/404.html", ".cloudflare/prepare.mjs"]);
            expect(files[0].content).toContain('<html lang="en">');
            expect(files[0].content).toContain("<title>Page not found</title>");
            expect(files[0].content).toContain("<main>");
            expect(files[0].content).toContain("<h1>Page not found</h1>");
            expect(files[0].content).toContain('<a href="/">Go to home page</a>');
            expect(files[0].content).not.toContain("Team handbook");
        });

        test("다른 작업 폴더에서 실행해도 공백과 따옴표 포함 문서 폴더에 404 페이지를 복사한다", async ({root}) => {
            const files = await toDeployFiles({title: "Guide", content: "team's docs #1% $&", lang: "en", deploy: "cloudflare-pages", branch: "main", manager: "npm"});
            for (const file of files) {
                await mkdir(dirname(join(root, file.path)), {recursive: true});
                await writeFile(join(root, file.path), file.content);
            }
            await mkdir(join(root, "team's docs #1% $&", "dist"), {recursive: true});
            await mkdir(join(root, "elsewhere"));

            const result = spawnSync(process.execPath, [join(root, ".cloudflare/prepare.mjs")], {cwd: join(root, "elsewhere"), encoding: "utf8"});

            expect(result.stderr).toBe("");
            expect(result.status).toBe(0);
            expect(await readFile(join(root, "team's docs #1% $&", "dist", "404.html"), "utf8")).toBe(files[0].content);
        });

        test("큰따옴표가 포함된 문서 경로도 유효한 Node 모듈로 생성한다", async ({root}) => {
            const files = await toDeployFiles({
                title: "Guide",
                content: "team \"guide\" and 'notes' $& $$",
                lang: "en",
                deploy: "cloudflare-pages",
                branch: "main",
                manager: "npm",
            });
            await writeFile(join(root, "prepare.mjs"), files[1].content);

            const result = spawnSync(process.execPath, ["--check", join(root, "prepare.mjs")], {encoding: "utf8"});

            expect(result.stderr).toBe("");
            expect(result.status).toBe(0);
        });

        test("빌드 결과가 없으면 복사에 실패하고 출력 폴더를 만들지 않는다", async ({root}) => {
            const files = await toDeployFiles({title: "Guide", content: "content", lang: "en", deploy: "cloudflare-pages", branch: "main", manager: "npm"});
            for (const file of files) {
                await mkdir(dirname(join(root, file.path)), {recursive: true});
                await writeFile(join(root, file.path), file.content);
            }

            const result = spawnSync(process.execPath, [join(root, ".cloudflare/prepare.mjs")], {cwd: root, encoding: "utf8"});

            expect(result.status).not.toBe(0);
            expect(result.stderr).toContain("Build the documentation output");
            expect(result.stderr).toContain("ENOENT");
            await expect(stat(join(root, "content", "dist"))).rejects.toMatchObject({code: "ENOENT"});
        });
    });

    describe("생성된 상태 화면", () => {
        test.for(["cloudflare-pages", "cloudflare-workers"] as const)("%s 준비 스크립트는 빌드가 생성한 사용자 404 화면을 보존한다", async (deploy, {root}) => {
            const files = await toDeployFiles({title: "Guide", content: "team notes", lang: "en", deploy, workerName: "team-docs", branch: "main", manager: "npm"});

            for (const file of files) {
                await mkdir(dirname(join(root, file.path)), {recursive: true});
                await writeFile(join(root, file.path), file.content);
            }

            await mkdir(join(root, "team notes/dist"), {recursive: true});
            await writeFile(join(root, "team notes/dist/404.html"), "CUSTOM_BUILT_STATUS_PAGE");

            const result = spawnSync(process.execPath, [join(root, ".cloudflare/prepare.mjs")], {cwd: root, encoding: "utf8"});
            const html = await readFile(join(root, "team notes/dist/404.html"), "utf8");

            expect(result.status, result.stderr).toBe(0);
            expect(html).toBe("CUSTOM_BUILT_STATUS_PAGE");
        });
    });
});
