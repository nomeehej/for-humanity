import {z} from "zod";
import {content_default} from "@/constant/content";
import {
    copy_error_navigation_clash,
    copy_error_ref_duplicate,
    copy_error_ref_prefix,
    copy_error_site_base_path,
    copy_error_site_host,
    copy_error_site_image,
    copy_error_site_lang,
    copy_error_site_link_target,
    copy_error_site_locale,
    copy_error_site_url,
    copy_error_status_image,
    copy_site_title_default,
} from "@/constant/copy";
import {ref_color, ref_prefix_pattern} from "@/constant/ref";
import {
    site_base_path_default,
    site_base_path_pattern,
    site_cursor_face_default,
    site_host_default,
    site_image_pattern,
    site_lang_default,
    site_lang_pattern,
    site_link_target,
    site_link_target_default,
    site_locale_pattern,
    site_locales_default,
    site_navigation_default,
    site_port_default,
    site_port_max,
    site_port_min,
    site_status_image_pattern,
} from "@/constant/site";
import {status_default_phrases, status_kind} from "@/constant/status";
import {contentConfigSchema} from "@/type/content-config";
import {groupPathSchema} from "@/type/group-path";

// ----------------------------------------------------------------------------------------
// 사이트 설정의 입력 검증과 기본값 적용
//
// content: 프로젝트 기준 문서 루트와 공개 범위
// title: 사이드바 이름과 탭 제목
// description: HTML 설명 메타데이터, 선택, 문서 페이지는 label 우선
// lang: 문서 언어, html lang 속성
// locales: 번역 언어, 키는 폴더 이름, URL 접두, html lang 겸용, 설정 순서 목록으로 정규화
// locales.description: 번역 홈의 검색 결과와 링크 미리보기 설명
// basePath: 사이트의 배포 경로, 검증 후 끝 슬래시 포함
// url: 공개 사이트 루트 URL, 지정 시에만 robots.txt, sitemap.xml, 대표 주소,
//   링크 미리보기 태그 생성
// image: 링크 미리보기 이미지, 문서 루트 기준 경로, url 지정 시에만 배포
// statusImage: 상태 화면 이미지의 문서 루트 기준 경로, 생략 시 기본 픽셀 얼굴
// port: dev, preview 서버 포트, 같은 기계의 문서 프로젝트 둘 병행 시 한쪽에 지정
// host: dev와 preview 수신 주소, true면 LAN 전체, false와 생략이면 localhost
// cursorFace: 데스크톱 커서 옆 픽셀 얼굴, 기본 비활성, favicon은 설정과 무관
// linkTarget: 본문 링크의 열림 위치, 같은 문서의 hash 링크는 항상 현재 탭
// navigation: 탐색 묶음 경로의 읽는 순서, 미지정 형제 묶음은 뒤에서 이름순
// status: 본문에서 상태 표지로 표시할 문구
// status.phrase: 찾을 문구 원문
// status.kind: 상태 표지의 색 종류
// status.date: 문구 뒤의 YYYY-MM-DD 날짜 포함 여부
// refs: 참조 칩으로 표시할 접두 목록, 대상은 글자가 접두와 번호인 링크
// refs.prefix: 대문자 1~3자 접두, Q, BE 등
// refs.color: 칩 색, 생략 시 gray
// ----------------------------------------------------------------------------------------
export const siteConfigSchema = z.object({
    content: contentConfigSchema.default(content_default),
    title: z.string().default(copy_site_title_default),
    description: z.string().optional(),
    lang: z.string().regex(site_lang_pattern, copy_error_site_lang).default(site_lang_default),

    locales: z
        .record(
            z.string().regex(site_locale_pattern, copy_error_site_locale),
            z.object({
                description: z.string().optional(),
            }),
        )
        .transform((locales) => Object.entries(locales).map(([code, locale]) => ({code, description: locale.description})))
        .prefault(site_locales_default),

    basePath: z
        .string()
        .regex(site_base_path_pattern, copy_error_site_base_path)
        .refine((value) => !value.split("/").some((segment) => segment === "." || segment === ".."), copy_error_site_base_path)
        .transform((value): `/${string}` => `/${value.slice(1)}${value.endsWith("/") ? "" : "/"}`)
        .default(site_base_path_default),

    url: z
        .url({protocol: /^https?$/})
        .transform((value) => new URL(value))
        .refine((value) => value.username === "" && value.password === "" && value.pathname === "/" && value.search === "" && value.hash === "", copy_error_site_url)
        .transform((value) => value.origin)
        .optional(),

    image: z.string().regex(site_image_pattern, copy_error_site_image).optional(),
    statusImage: z.string().regex(site_status_image_pattern, copy_error_status_image).optional(),
    port: z.int().min(site_port_min).max(site_port_max).default(site_port_default),
    host: z.union([z.boolean(), z.ipv4(), z.ipv6(), z.hostname()], {error: copy_error_site_host}).default(site_host_default),
    cursorFace: z.boolean().default(site_cursor_face_default),
    linkTarget: z.enum(site_link_target, {error: copy_error_site_link_target}).default(site_link_target_default),

    navigation: z
        .array(groupPathSchema)
        .refine((groups) => new Set(groups.map((path) => JSON.stringify(path))).size === groups.length, copy_error_navigation_clash)
        .default(site_navigation_default),

    status: z
        .array(
            z.object({
                phrase: z
                    .string()
                    .min(1)
                    .refine((phrase) => phrase.trim().length > 0),

                kind: z.enum(status_kind),
                date: z.boolean().optional(),
            }),
        )
        .default(status_default_phrases),

    refs: z
        .array(
            z.object({
                prefix: z.string().regex(ref_prefix_pattern, copy_error_ref_prefix),
                color: z.enum(ref_color).default(ref_color.gray),
            }),
        )
        .refine((refs) => new Set(refs.map((ref) => ref.prefix)).size === refs.length, copy_error_ref_duplicate)
        .default([]),
});

// ----------------------------------------------------------------------------------------
// 기본값 적용 사이트 설정
// ----------------------------------------------------------------------------------------
export type ResolvedSiteConfig = z.infer<typeof siteConfigSchema>;

// 예외: 공개 설정 타입은 JSDoc 유지, dist/type/site-config.d.ts로 배포되어 편집기의 필드 설명으로 표시
/**
 * 작성자가 지정하는 사이트 설정, 기본값 적용 전 입력
 */
export interface SiteConfig {
    /**
     * 기본 content/public, content/private 구조의 경로 변경
     */
    content?: z.input<typeof siteConfigSchema>["content"];

    /**
     * 사이드바 이름과 탭 제목, 생략 시 for humanity
     */
    title?: z.input<typeof siteConfigSchema>["title"];

    /**
     * 홈 페이지의 검색 결과와 링크 미리보기 설명, 문서 페이지는 각 문서의 label 사용
     */
    description?: z.input<typeof siteConfigSchema>["description"];

    /**
     * 문서 언어 태그, 기본값 ko. 예: en, en-US
     */
    lang?: z.input<typeof siteConfigSchema>["lang"];

    /**
     * 번역 언어별 설정. 키는 문서 루트 아래 폴더 이름이자 URL 접두, 예: {ko: {description: "한국어 안내"}}
     */
    locales?: z.input<typeof siteConfigSchema>["locales"];

    /**
     * 배포할 하위 경로, 기본값 /. 예: /project/
     */
    basePath?: z.input<typeof siteConfigSchema>["basePath"];

    /**
     * 공개 HTTP(S) 루트 주소, 지정 시 robots.txt, sitemap.xml, 대표 주소, 링크 미리보기 태그 생성
     */
    url?: z.input<typeof siteConfigSchema>["url"];

    /**
     * 링크 미리보기 이미지의 문서 루트 기준 경로. PNG, JPEG, GIF, WebP, url과 함께 사용
     */
    image?: z.input<typeof siteConfigSchema>["image"];

    /**
     * 상태 화면 이미지의 문서 루트 기준 경로, SVG, PNG, JPEG, GIF, WebP, AVIF
     */
    statusImage?: z.input<typeof siteConfigSchema>["statusImage"];

    /**
     * dev와 preview 포트, 1부터 65535까지 정수, 기본값 4321
     */
    port?: z.input<typeof siteConfigSchema>["port"];

    /**
     * dev와 preview 수신 주소, true는 LAN 전체, false와 생략은 localhost
     */
    host?: z.input<typeof siteConfigSchema>["host"];

    /**
     * 데스크톱 커서 얼굴 표시, 기본값 false
     */
    cursorFace?: z.input<typeof siteConfigSchema>["cursorFace"];

    /**
     * 본문 링크가 열리는 자리, new-tab 또는 same-tab. 기본값 new-tab, 같은 문서의 hash 링크는 늘 현재 탭
     */
    linkTarget?: z.input<typeof siteConfigSchema>["linkTarget"];

    /**
     * 탐색 묶음의 표시 순서, 문자열 또는 중첩 이름 경로
     */
    navigation?: z.input<typeof siteConfigSchema>["navigation"];

    /**
     * 상태 표지 목록, 빈 배열 지정 시 상태 표지 미표시
     */
    status?: z.input<typeof siteConfigSchema>["status"];

    /**
     * 참조 칩 접두 목록, 생략 시 칩 없음
     */
    refs?: z.input<typeof siteConfigSchema>["refs"];
}
