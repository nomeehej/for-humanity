import type {ResolvedSiteConfig} from "@/type/site-config";

// ----------------------------------------------------------------------------------------
// 사이트 안 URL의 배포 경로 적용 입력
//
// basePath: 끝 슬래시 포함 검증된 배포 경로
// path: 사이트 루트 기준 URL, 외부 주소와 해시는 원문 유지
// ----------------------------------------------------------------------------------------
interface SitePathParams {
    basePath: ResolvedSiteConfig["basePath"];
    path: string;
}

// ----------------------------------------------------------------------------------------
// 사이트 루트 URL의 배포 경로 적용
//
// 쿼리와 해시 보존
// ----------------------------------------------------------------------------------------
export const toSitePath = (params: SitePathParams) => {
    return params.path.startsWith("/") && !params.path.startsWith("//") ? `${params.basePath}${params.path.slice(1)}` : params.path;
};
