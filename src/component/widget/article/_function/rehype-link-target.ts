import type {Root} from "hast";
import {visit} from "unist-util-visit";
import type {ResolvedSiteConfig} from "@/type/site-config";

/**
 * 본문 링크가 열리는 자리의 설정
 */
interface LinkTargetOptions {
    /**
     * 사이트 설정의 linkTarget
     */
    linkTarget: ResolvedSiteConfig["linkTarget"];
}

/**
 * 본문 링크를 새 탭에서 여는 target 속성
 *
 *   - 같은 문서의 `#hash` 링크는 현재 탭. 읽던 자리 안의 이동
 *   - 작성자가 원시 HTML 에 target 을 쓴 링크는 그대로
 *   - same-tab 설정은 아무것도 바꾸지 않음
 */
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
