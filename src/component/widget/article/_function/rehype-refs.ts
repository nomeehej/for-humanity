import type {Element, Root} from "hast";
import {toString as toPlainText} from "hast-util-to-string";
import {visit} from "unist-util-visit";
import {id_link_text_pattern, ref_text_pattern} from "@/constant/ref";
import type {ResolvedSiteConfig} from "@/type/site-config";

// ----------------------------------------------------------------------------------------
// 참조 칩 변환 대상 설정 접두
//
// refs: 사이트 설정의 접두와 색
// ----------------------------------------------------------------------------------------
interface RefOptions {
    refs: ResolvedSiteConfig["refs"];
}

// ----------------------------------------------------------------------------------------
// 제목 요소 이름
// ----------------------------------------------------------------------------------------
const heading_pattern = /^h[1-6]$/;

// ----------------------------------------------------------------------------------------
// 요소의 class 목록
//
// 문자열, 배열, 없음 입력은 모두 배열 반환
// ----------------------------------------------------------------------------------------
const toClassList = (node: Element): string[] => {
    const value = node.properties.className;

    if (Array.isArray(value)) {
        return value.map(String);
    }

    return typeof value === "string" ? [value] : [];
};

// ----------------------------------------------------------------------------------------
// Details 제목 맨 앞 낱말
//
// 캡처는 앞 공백과 낱말 순서
// 낱말 뒤는 공백이나 문자열 끝 조건
// ----------------------------------------------------------------------------------------
const summary_lead_pattern = /^(\s*)(\S+)(?=\s|$)/;

// ----------------------------------------------------------------------------------------
// 글자가 접두와 번호인 링크와 제목, Details 제목 맨 앞 낱말의 참조 칩 class
//
// 링크는 글자가 텍스트 하나이고 설정 접두 뒤 숫자인 경우만 대상
// 링크 주소는 유지
// 제목은 rehype-heading-ids가 감싼 안쪽 span에 적용
// 본문 칩과 그 앵커의 모양 일치
// Details 제목은 맨 앞 낱말만 span으로 래핑
// Details 제목은 링크 없음, 제목 줄 전체가 토글 버튼
// `SSD-001`처럼 하이픈 식별자인 링크는 설정과 무관하게 한 줄 class
// 하이픈 식별자 링크는 칩 미적용
// ----------------------------------------------------------------------------------------
export const rehypeRefs = (options: RefOptions) => {
    const colorByPrefix = new Map(options.refs.map((ref) => [ref.prefix, ref.color]));

    const toColor = (text: string) => {
        const match = ref_text_pattern.exec(text.trim());

        return match === null ? undefined : colorByPrefix.get(match[1]);
    };

    return (tree: Root) => {
        visit(tree, "element", (node) => {
            if (node.tagName === "a") {
                const [child] = node.children;

                if (node.children.length !== 1 || child.type !== "text") {
                    return;
                }

                if (id_link_text_pattern.test(child.value.trim())) {
                    node.properties.className = [...toClassList(node), "article__idLink"];

                    return;
                }

                const color = toColor(child.value);

                if (color === undefined) {
                    return;
                }

                node.properties.className = [...toClassList(node), "article__ref", `article__ref--${color}`];

                return;
            }

            if (node.tagName === "summary") {
                const [first] = node.children;
                const match = first?.type === "text" ? summary_lead_pattern.exec(first.value) : null;
                const color = match === null ? undefined : toColor(match[2]);

                if (first?.type !== "text" || match === null || color === undefined) {
                    return;
                }

                node.children.splice(
                    0,
                    1,
                    ...(match[1] === "" ? [] : [{type: "text" as const, value: match[1]}]),
                    {type: "element", tagName: "span", properties: {className: ["article__ref", `article__ref--${color}`]}, children: [{type: "text", value: match[2]}]},
                    {type: "text", value: first.value.slice(match[0].length)},
                );

                return;
            }

            if (!heading_pattern.test(node.tagName)) {
                return;
            }

            const [span] = node.children;

            if (node.children.length !== 1 || span.type !== "element" || span.tagName !== "span") {
                return;
            }

            const color = toColor(toPlainText(span));

            if (color === undefined) {
                return;
            }

            span.properties.className = [...toClassList(span), "article__ref", "article__ref--heading", `article__ref--${color}`];
        });
    };
};
