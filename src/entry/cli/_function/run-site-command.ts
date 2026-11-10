import {copyFile, mkdir, rm, writeFile} from "node:fs/promises";
import {dirname, join, relative} from "node:path";
import {fileURLToPath} from "node:url";
import type {ParsedArgs} from "citty";
import {toSSG} from "hono/ssg";
import {readProject} from "@/app/_function/read-project";
import {loadSite} from "@/app/load-site";
import {asset_not_found_path} from "@/constant/asset";
import {content_output_dir, content_private_output_dir} from "@/constant/content";
import {site_host_network} from "@/constant/site";
import type {command_args, command_build_args, command_server_args} from "@/entry/cli/_constant/command";
import {copy_error_project_args, copy_private_notice} from "@/entry/cli/_constant/copy";
import {toPreviewConfig} from "@/entry/preview/to-preview-config";
import {siteConfigSchema} from "@/type/site-config";
import {toErrorMessage} from "@/util/error/to-error-message";
import {logger} from "@/util/logger/logger";

/**
 * 사이트 명령 실행 입력
 */
interface CliCommandParams {
    /**
     * Citty가 선택한 사이트 명령
     */
    command: "dev" | "build" | "preview";

    /**
     * 기본 문서 경로를 적용한 Citty 인자
     */
    args: ParsedArgs<typeof command_args> & {
        /**
         * dev와 preview의 일회성 수신 주소, 생략 시 설정 파일 사용
         */
        host?: ParsedArgs<typeof command_server_args>["host"];

        /**
         * build의 내부판 출력 선택, 생략 시 공개판
         */
        private?: ParsedArgs<typeof command_build_args>["private"];
    };
}

/**
 * 사이트 명령 실행과 실패 시 종료 코드 1
 */
export const runSiteCommand = async (params: CliCommandParams) => {
    try {
        if (params.args._.length > 1) {
            throw new Error(copy_error_project_args);
        }

        // CLI 입력 검증과 설정 파일보다 우선하는 수신 주소
        const host = params.args.host === undefined ? undefined : siteConfigSchema.shape.host.parse(params.args.host === "" ? site_host_network : params.args.host);

        // dist의 실행 청크 기준 패키지 루트
        const kitRoot = fileURLToPath(new URL("../", import.meta.url));
        const project = await readProject(params.args.dir);
        const site = {...project.site, host: host ?? project.site.host};
        const outDir = join(project.root, params.args.private === true ? content_private_output_dir : content_output_dir);

        if (params.command === "preview") {
            const vite = await import("vite");
            const server = await vite.preview(toPreviewConfig({root: project.root, port: site.port, host: site.host, basePath: site.basePath}));

            server.printUrls();

            return;
        }

        if (params.command === "dev") {
            const dev = await import("@/entry/dev/start-dev-server");

            await dev.startDevServer({root: project.root, kitRoot, site, source: false, includePrivate: true});

            return;
        }

        const snapshot = await loadSite({
            root: project.root,
            kitRoot,

            // 내부판의 배포 주소는 공개 주소와 별개, 공개 주소 기준 출력 제외
            site: params.args.private === true ? {...project.site, url: undefined} : project.site,
            includePrivate: params.args.private,
            noindex: params.args.private,
        });

        // 삭제된 문서와 자원의 잔여 파일 방지
        await rm(outDir, {recursive: true, force: true});

        const result = await toSSG(snapshot.pages, {writeFile, mkdir}, {dir: outDir});

        if (!result.success) {
            throw result.error;
        }

        const crawling = snapshot.crawling === undefined ? undefined : await toSSG(snapshot.crawling, {writeFile, mkdir}, {dir: outDir});

        if (crawling?.success === false) {
            throw crawling.error;
        }

        await writeFile(join(outDir, asset_not_found_path), snapshot.notFound);

        for (const [url, file] of snapshot.files) {
            await mkdir(dirname(join(outDir, url)), {recursive: true});
            await copyFile(file, join(outDir, url));
        }

        logger.success(
            `${(crawling === undefined ? result.files.length : result.files.length + crawling.files.length) + 1} files, ${snapshot.files.size} assets → ${relative(process.cwd(), outDir)}`,
        );

        if (params.args.private === true) {
            logger.info(copy_private_notice);
        }
    } catch (error) {
        logger.error(toErrorMessage(error));
        process.exitCode = 1;
    }
};
