import {WgArticle} from "@/component/widget/article/wg-article";
import {WgShell} from "@/component/widget/shell/wg-shell";
import type {Doc} from "@/type/doc";
import type {SiteAssets} from "@/type/site-assets";
import type {ResolvedSiteConfig} from "@/type/site-config";

// ----------------------------------------------------------------------------------------
// /:slug/ 문서 페이지 입력
//
// 렌더링된 HTML 사용
//
// site: 검증된 사이트 설정
// docs: 사이드바의 전체 문서
// assets: HTML 머리의 공통 자원
// doc: 현재 페이지의 문서
// ----------------------------------------------------------------------------------------
export interface PgDocProps {
    site: ResolvedSiteConfig;
    docs: Doc[];
    assets: SiteAssets;
    doc: Doc;
}

export const PgDoc = (props: PgDocProps) => {
    return (
        <WgShell
            site={props.site}
            docs={props.docs}
            assets={props.assets}
            title={props.doc.data.name}
            description={props.doc.data.label}
            current={props.doc.id}
            locale={props.doc.locale}
            outline={props.doc.outline}
        >
            <WgArticle html={props.doc.html} />
        </WgShell>
    );
};
