import {array, boolean, custom, lazy, minLength, number, object, optional, string, type ZodMiniType} from "zod/mini";
import type {NavigationData, NavigationDoc, NavigationGroup} from "@/component/widget/sidebar/_type/navigation-data";

// ----------------------------------------------------------------------------------------
// 본문과 파일 경로 제외 탐색 문서의 브라우저 입력 검증
//
// id: 링크에 사용할 문서 ID
// name: 링크 표시 이름
// label: 링크의 보조 설명
// active: 현재 페이지 강조 여부
// children: 같은 문서 아래의 재귀 탐색 목록
// ----------------------------------------------------------------------------------------
const navigationDocSchema: ZodMiniType<NavigationDoc> = object({
    id: string(),
    name: string(),
    label: string(),
    active: boolean(),
    children: lazy(() => array(navigationDocSchema)),
});

// ----------------------------------------------------------------------------------------
// 전체 경로로 구분한 탐색 묶음의 브라우저 입력 검증
//
// name: 클릭하지 않는 묶음 이름
// path: 최상위부터 현재 묶음까지의 이름 경로
// docs: 현재 단계의 문서 목록
// groups: 하위 탐색 묶음
// ----------------------------------------------------------------------------------------
const navigationGroupSchema: ZodMiniType<NavigationGroup> = object({
    name: string(),
    path: array(string()),
    docs: array(navigationDocSchema),
    groups: lazy(() => array(navigationGroupSchema)),
});

// ----------------------------------------------------------------------------------------
// 본문 제목과 목차 링크의 연결 검증
//
// depth: 본문의 제목 깊이
// slug: 이동 대상의 HTML ID
// text: 목차 표시 문자열
// ----------------------------------------------------------------------------------------
const headingSchema = object({
    depth: number(),
    slug: string(),
    text: string(),
});

// ----------------------------------------------------------------------------------------
// HTML에 포함된 JSON의 브라우저 조회 경계
//
// 손상된 자료에는 서버 HTML 유지
//
// basePath: 서버에서 검증한 탐색 URL의 배포 경로
// title: 홈 링크의 브랜드 이름
// homePath: 브랜드 링크가 가리키는 현재 언어 홈의 사이트 경로
// groups: 표시 순서가 확정된 문서 트리
// signature: 같은 문서 목록의 저장 위치만 복원하는 목록 식별값
// outline: 현재 페이지의 가름별 목차
// outline.part: 묶음 위에 표시할 가름 이름
// outline.sections: 하나 이상의 절과 하위 제목
// outline.sections.heading: 절의 이동 대상과 표시명
// outline.sections.part: 이 절에서 시작하는 가름 이름
// outline.sections.subs: 본문 순서의 하위 제목 목록
// outline.sections.subs.heading: 소제목의 이동 대상과 표시명
// home: README 홈 여부
// cursorFace: 사이트 설정의 커서 장식 활성화 여부
// ----------------------------------------------------------------------------------------
export const navigationDataSchema: ZodMiniType<NavigationData> = object({
    basePath: custom<NavigationData["basePath"]>((value) => typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && value.endsWith("/")),
    title: string(),
    homePath: string(),
    groups: array(navigationGroupSchema),
    signature: string(),

    outline: array(
        object({
            part: optional(string()),

            sections: array(
                object({
                    heading: headingSchema,
                    part: optional(string()),

                    subs: array(
                        object({
                            heading: headingSchema,
                        }),
                    ),
                }),
            ).check(minLength(1)),
        }),
    ),
    home: boolean(),
    cursorFace: boolean(),
});
