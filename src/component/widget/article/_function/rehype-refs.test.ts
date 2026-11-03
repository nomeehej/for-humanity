import type {Element, Root} from "hast";
import {describe, expect, test} from "vitest";
import {rehypeRefs} from "@/component/widget/article/_function/rehype-refs";

/**
 * 참조 칩 class(src/component/widget/article/_function/rehype-refs.ts) 검증
 */
describe("참조 칩", () => {
    const refs = [
        {prefix: "Q", color: "violet"},
        {prefix: "BE", color: "gray"},
    ] as const;

    const toLinkTree = (text: string): Root => {
        return {
            type: "root",
            children: [
                {
                    type: "element",
                    tagName: "p",
                    properties: {},
                    children: [{type: "element", tagName: "a", properties: {href: "/questions/#q3"}, children: [{type: "text", value: text}]}],
                },
            ],
        };
    };

    const toHeadingTree = (text: string): Root => {
        return {
            type: "root",
            children: [
                {
                    type: "element",
                    tagName: "h3",
                    properties: {id: text.toLowerCase()},
                    children: [{type: "element", tagName: "span", properties: {className: ["wg_article__headingText"]}, children: [{type: "text", value: text}]}],
                },
            ],
        };
    };

    const toFirstChild = (tree: Root): Element => {
        return (tree.children[0] as Element).children[0] as Element;
    };

    describe("접두와 번호인 링크 글자", () => {
        test.each([
            {text: "Q3", className: ["wg_article__ref", "wg_article__ref--violet"]},
            {text: "BE12", className: ["wg_article__ref", "wg_article__ref--gray"]},
        ])("설정 접두의 $text 링크는 색 class 를 단다", (scenario) => {
            /**
             * GIVEN
             * 설정 접두 Q(violet), BE(gray)와 링크 하나
             */
            const tree = toLinkTree(scenario.text);

            /**
             * WHEN
             * 참조 칩 표시
             */
            rehypeRefs({refs: [...refs]})(tree);

            /**
             * THEN
             * 링크의 class
             */
            expect(toFirstChild(tree).properties.className).toStrictEqual(scenario.className);
        });

        test.each(["Q3a", "q3", "D1", "Q"])("접두와 번호가 아닌 %s 링크는 그대로 둔다", (text) => {
            /**
             * GIVEN
             * 설정 접두 Q와 글자가 다른 링크
             */
            const tree = toLinkTree(text);

            /**
             * WHEN
             * 참조 칩 표시
             */
            rehypeRefs({refs: [...refs]})(tree);

            /**
             * THEN
             * class 없음
             */
            expect(toFirstChild(tree).properties.className).toBeUndefined();
        });
    });

    describe("접두와 번호인 제목", () => {
        test("번호 하나인 제목의 안쪽 span 은 제목용 칩 class 를 단다", () => {
            /**
             * GIVEN
             * rehype-heading-ids 가 감싼 제목 B9
             */
            const tree = toHeadingTree("BE9");

            /**
             * WHEN
             * 참조 칩 표시
             */
            rehypeRefs({refs: [...refs]})(tree);

            /**
             * THEN
             * 기존 class 뒤에 칩 class
             */
            expect(toFirstChild(tree).properties.className).toStrictEqual(["wg_article__headingText", "wg_article__ref", "wg_article__ref--heading", "wg_article__ref--gray"]);
        });

        test("번호가 아닌 제목은 그대로 둔다", () => {
            /**
             * GIVEN
             * 보통 제목
             */
            const tree = toHeadingTree("Pattern detail");

            /**
             * WHEN
             * 참조 칩 표시
             */
            rehypeRefs({refs: [...refs]})(tree);

            /**
             * THEN
             * 감싼 class 만
             */
            expect(toFirstChild(tree).properties.className).toStrictEqual(["wg_article__headingText"]);
        });
    });

    describe("하이픈 식별자 링크", () => {
        test.each(["SSD-001", "PROJ-12"])("%s 링크는 설정 접두가 없어도 한 줄 class 를 단다", (text) => {
            /**
             * GIVEN
             * 설정에 없는 접두의 하이픈 식별자 링크
             */
            const tree = toLinkTree(text);

            /**
             * WHEN
             * 참조 칩 표시, 설정 접두 없음
             */
            rehypeRefs({refs: []})(tree);

            /**
             * THEN
             * 식별자 class 하나
             */
            expect(toFirstChild(tree).properties.className).toStrictEqual(["wg_article__idLink"]);
        });

        test.each(["ssd-001", "SSD-01a", "SSD 001", "Q3"])("%s 링크는 식별자 class 를 달지 않는다", (text) => {
            /**
             * GIVEN
             * 하이픈 식별자가 아닌 링크
             */
            const tree = toLinkTree(text);

            /**
             * WHEN
             * 참조 칩 표시, 설정 접두 없음
             */
            rehypeRefs({refs: []})(tree);

            /**
             * THEN
             * class 없음
             */
            expect(toFirstChild(tree).properties.className).toBeUndefined();
        });
    });

    describe("Details 제목 맨 앞 낱말", () => {
        const toSummaryTree = (text: string): Root => {
            return {
                type: "root",
                children: [{type: "element", tagName: "summary", properties: {className: ["wg_article__detailsSummary"]}, children: [{type: "text", value: text}]}],
            };
        };

        test("설정 접두와 번호인 맨 앞 낱말은 칩 span 으로 감싸고 나머지 글자는 그대로 둔다", () => {
            /**
             * GIVEN
             * 번호로 시작하는 Details 제목
             */
            const tree = toSummaryTree("Q9 · 합계에 타겟 행을 넣나요?");

            /**
             * WHEN
             * 참조 칩 표시
             */
            rehypeRefs({refs: [...refs]})(tree);

            /**
             * THEN
             * 칩 span 과 뒤 글자
             */
            expect((tree.children[0] as Element).children).toStrictEqual([
                {type: "element", tagName: "span", properties: {className: ["wg_article__ref", "wg_article__ref--violet"]}, children: [{type: "text", value: "Q9"}]},
                {type: "text", value: " · 합계에 타겟 행을 넣나요?"},
            ]);
        });

        test.each(["Q9a · 번호 뒤 글자", "D1 · 설정에 없는 접두", "Questions 안내"])("맨 앞 낱말이 설정 번호가 아닌 %s 제목은 그대로 둔다", (text) => {
            /**
             * GIVEN
             * 번호로 시작하지 않는 Details 제목
             */
            const tree = toSummaryTree(text);

            /**
             * WHEN
             * 참조 칩 표시
             */
            rehypeRefs({refs: [...refs]})(tree);

            /**
             * THEN
             * 글자 하나 그대로
             */
            expect((tree.children[0] as Element).children).toStrictEqual([{type: "text", value: text}]);
        });
    });
});
