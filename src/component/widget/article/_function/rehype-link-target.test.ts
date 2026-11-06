import type {Element, Root} from "hast";
import {describe, expect, test} from "vitest";
import {rehypeLinkTarget} from "@/component/widget/article/_function/rehype-link-target";

/**
 * 본문 링크의 새 탭 target(src/component/widget/article/_function/rehype-link-target.ts) 검증
 */
describe("본문 링크의 새 탭", () => {
    const toTree = (properties: Element["properties"]): Root => {
        return {
            type: "root",
            children: [
                {
                    type: "element",
                    tagName: "p",
                    properties: {},
                    children: [{type: "element", tagName: "a", properties, children: [{type: "text", value: "link"}]}],
                },
            ],
        };
    };

    const toLink = (tree: Root): Element => {
        return (tree.children[0] as Element).children[0] as Element;
    };

    test.each([
        {label: "문서", href: "/guide/"},
        {label: "다른 문서의 제목", href: "/guide/#setup"},
        {label: "외부", href: "https://example.com/"},
    ])("new-tab 설정은 $label 링크 $href 에 target 과 rel 을 단다", (scenario) => {
        /**
         * GIVEN
         * target 없는 본문 링크 하나
         */
        const tree = toTree({href: scenario.href});

        /**
         * WHEN
         * 새 탭 설정으로 변환
         */
        rehypeLinkTarget({linkTarget: "new-tab"})(tree);

        /**
         * THEN
         * 새 탭 target 과 noopener
         */
        expect(toLink(tree).properties.target).toBe("_blank");
        expect(toLink(tree).properties.rel).toStrictEqual(["noopener"]);
    });

    test("같은 문서의 hash 링크는 현재 탭으로 둔다", () => {
        /**
         * GIVEN
         * 같은 문서의 제목을 가리키는 링크
         */
        const tree = toTree({href: "#setup"});

        /**
         * WHEN
         * 새 탭 설정으로 변환
         */
        rehypeLinkTarget({linkTarget: "new-tab"})(tree);

        /**
         * THEN
         * target 없음
         */
        expect(toLink(tree).properties.target).toBeUndefined();
        expect(toLink(tree).properties.rel).toBeUndefined();
    });

    test("작성자가 target 을 쓴 링크는 그대로 둔다", () => {
        /**
         * GIVEN
         * 원시 HTML 로 target 을 지정한 링크
         */
        const tree = toTree({href: "/guide/", target: "_self"});

        /**
         * WHEN
         * 새 탭 설정으로 변환
         */
        rehypeLinkTarget({linkTarget: "new-tab"})(tree);

        /**
         * THEN
         * 작성자의 target 유지
         */
        expect(toLink(tree).properties.target).toBe("_self");
        expect(toLink(tree).properties.rel).toBeUndefined();
    });

    test("same-tab 설정은 링크를 바꾸지 않는다", () => {
        /**
         * GIVEN
         * 본문 링크 하나
         */
        const tree = toTree({href: "/guide/"});

        /**
         * WHEN
         * 현재 탭 설정으로 변환
         */
        rehypeLinkTarget({linkTarget: "same-tab"})(tree);

        /**
         * THEN
         * target 없음
         */
        expect(toLink(tree).properties.target).toBeUndefined();
    });
});
