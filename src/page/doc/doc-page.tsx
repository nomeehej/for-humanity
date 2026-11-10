import {Article} from "@/component/widget/article/article";
import {Shell} from "@/component/widget/shell/shell";
import type {Doc} from "@/type/doc";
import type {SiteAssets} from "@/type/site-assets";
import type {ResolvedSiteConfig} from "@/type/site-config";

// ----------------------------------------------------------------------------------------
// /:slug/ 문서 페이지 입력
//
// 렌더된 HTML 사용
//
// docs: 사이드바의 전체 문서
// assets: HTML 머리의 공통 자원
// doc: 현재 페이지의 문서
// ----------------------------------------------------------------------------------------
export interface DocPageProps {
    site: ResolvedSiteConfig;
    docs: Doc[];
    assets: SiteAssets;
    doc: Doc;
}

export const DocPage = (props: DocPageProps) => {
    return (
        <Shell
            site={props.site}
            docs={props.docs}
            assets={props.assets}
            title={props.doc.data.name}
            description={props.doc.data.label}
            current={props.doc.id}
            locale={props.doc.locale}
            outline={props.doc.outline}
        >
            <Article html={props.doc.html} />
        </Shell>
    );
};
