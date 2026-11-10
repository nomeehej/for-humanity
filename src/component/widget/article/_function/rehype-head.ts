import type {Element, ElementContent, Root} from "hast";
import type {VFile} from "vfile";
import {copy_doc_dates} from "@/component/widget/article/_constant/copy";
import {section_heading_depth} from "@/component/widget/article/_constant/section";
import type {ResolvedSiteConfig} from "@/type/site-config";

// ----------------------------------------------------------------------------------------
// 문서 머리의 기본 언어
//
// lang: 번역 문서가 아닌 페이지의 언어, 날짜 라벨 선택 기준
// ----------------------------------------------------------------------------------------
interface HeadOptions {
    lang: ResolvedSiteConfig["lang"];
}

// ----------------------------------------------------------------------------------------
// name 제목, label 글머리, 작성 날짜와 첫 절 앞 본문의 공통 머리
//
// README는 원문의 h1 사용
// 제목과 다른 label만 제목 아래 한 줄 표시
// label은 사이드바 툴팁과 미리보기 설명과 같은 문장
// 날짜 라벨은 한국어 페이지에서 한국어, 그 밖의 페이지에서 영어
// 날짜는 작성한 값 유지
// ----------------------------------------------------------------------------------------
export const rehypeHead = (options: HeadOptions) => (tree: Root, file: VFile) => {
    const frontmatter = file.data.fh?.frontmatter;
    const firstSection = tree.children.findIndex((node) => node.type === "element" && node.tagName === `h${section_heading_depth.section}`);
    const leadEnd = firstSection === -1 ? tree.children.length : firstSection;

    // 제목도 리드도 없는 README는 머리 생략
    if (frontmatter === undefined && leadEnd === 0) {
        return;
    }

    const copy = copy_doc_dates[new Intl.Locale(file.data.fh?.locale ?? options.lang).language === "ko" ? "ko" : "en"];
    const dates = (["created", "revised"] as const).flatMap((key) => {
        const value = frontmatter?.[key];

        return value === undefined ? [] : [{label: copy[key], value}];
    });

    const head: Element = {
        type: "element",
        tagName: "header",
        properties: {className: ["article__head"]},
        children: [
            ...(frontmatter === undefined
                ? []
                : [
                      {
                          type: "element",
                          tagName: "h1",
                          properties: {className: ["article__title"]},
                          children: [{type: "text", value: frontmatter.name}],
                      } satisfies Element,
                  ]),
            ...(frontmatter === undefined || frontmatter.label.trim() === "" || frontmatter.label.trim() === frontmatter.name
                ? []
                : [
                      {
                          type: "element",
                          tagName: "p",
                          properties: {className: ["article__lead"]},
                          children: [{type: "text", value: frontmatter.label.trim()}],
                      } satisfies Element,
                  ]),
            ...(dates.length === 0
                ? []
                : [
                      {
                          type: "element",
                          tagName: "p",
                          properties: {className: ["article__dates"]},
                          children: dates.flatMap((date, index): ElementContent[] => [
                              {type: "text", value: `${index === 0 ? "" : ", "}${date.label} `},
                              {type: "element", tagName: "time", properties: {dateTime: date.value}, children: [{type: "text", value: date.value}]},
                          ]),
                      } satisfies Element,
                  ]),
            ...tree.children.slice(0, leadEnd).filter((node) => node.type !== "doctype"),
        ],
    };

    tree.children = [head, ...tree.children.slice(leadEnd)];
};
