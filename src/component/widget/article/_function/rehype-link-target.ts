import type {Root} from "hast";
import {visit} from "unist-util-visit";
import type {ResolvedSiteConfig} from "@/type/site-config";

// ----------------------------------------------------------------------------------------
// 본문 링크의 열림 위치 설정
// ----------------------------------------------------------------------------------------
interface LinkTargetOptions {
    linkTarget: ResolvedSiteConfig["linkTarget"];
}

// ----------------------------------------------------------------------------------------
// 본문 링크의 새 탭 target 속성
//
// 같은 문서의 `#hash` 링크는 현재 탭, 읽던 위치 안의 이동
// 원시 HTML에 작성자 target이 있는 링크는 유지
// same-tab 설정은 링크 변경 없음
// ----------------------------------------------------------------------------------------
export const rehypeLinkTarget = (options: LinkTargetOptions) => (tree: Root) => {
    if (options.linkTarget !== "new-tab") {
        return;
    }

    visit(tree, "element", (node) => {
        const href = node.properties.href;

        if (node.tagName !== "a" || typeof href !== "string" || href.startsWith("#") || node.properties.target !== undefined) {
            return;
        }

        node.properties.target = "_blank";
        node.properties.rel ??= ["noopener"];
    });
};
