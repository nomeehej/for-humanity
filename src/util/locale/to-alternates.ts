import type {Doc} from "@/type/doc";
import type {ResolvedSiteConfig} from "@/type/site-config";
import {toPagePath} from "@/util/url/to-page-path";

// ----------------------------------------------------------------------------------------
// 현재 페이지의 언어판 하나
//
// code: 번역 언어 코드, 기본 언어는 생략
// lang: html lang과 hreflang 값
// path: 같은 페이지의 언어판 경로
// ----------------------------------------------------------------------------------------
export interface PageAlternate {
    code?: Doc["locale"];
    lang: ResolvedSiteConfig["lang"];
    path: string;
}

// ----------------------------------------------------------------------------------------
// 언어판 조회 입력
//
// site: 기본 언어와 번역 언어 설정
// docs: 번역 존재 여부를 확인할 전체 문서
// current: 현재 문서 id, 홈이면 생략
// locale: 현재 페이지의 언어 코드, 기본 언어면 생략
// ----------------------------------------------------------------------------------------
interface AlternatesParams {
    site: ResolvedSiteConfig;
    docs: readonly Doc[];
    current?: Doc["id"];
    locale?: Doc["locale"];
}

// ----------------------------------------------------------------------------------------
// 기본 언어부터 설정 순서로 현재 페이지가 실제로 있는 언어판
//
// 홈은 모든 언어, 문서는 언어 접두사를 뺀 같은 경로의 번역
// ----------------------------------------------------------------------------------------
export const toAlternates = (params: AlternatesParams): PageAlternate[] => {
    const key = params.current === undefined || params.locale === undefined ? params.current : params.current.slice(params.locale.length + 1);
    const ids = new Set(params.docs.map((doc) => doc.id));

    return [{code: undefined, lang: params.site.lang}, ...params.site.locales.map((locale) => ({code: locale.code, lang: locale.code}))].flatMap((language) => {
        if (key === undefined) {
            return [{...language, path: toPagePath(language.code)}];
        }

        const id = language.code === undefined ? key : `${language.code}/${key}`;

        return ids.has(id) ? [{...language, path: toPagePath(id)}] : [];
    });
};
