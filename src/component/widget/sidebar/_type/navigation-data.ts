import type {TocGroup} from "@/component/widget/sidebar/_type/toc-group";
import type {Doc} from "@/type/doc";
import type {DocData} from "@/type/doc-data";
import type {ResolvedSiteConfig} from "@/type/site-config";

// ----------------------------------------------------------------------------------------
// 브라우저 문서 가지
//
// 본문, 파일 경로를 포함하지 않는 탐색 전용 계약
//
// label: 링크의 보조 설명
// active: 현재 페이지 한 항목만 강조
// children: 클릭 가능한 하위 문서
// ----------------------------------------------------------------------------------------
export interface NavigationDoc {
    id: Doc["id"];
    name: DocData["name"];
    label: DocData["label"];
    active: boolean;
    children: NavigationDoc[];
}

// ----------------------------------------------------------------------------------------
// 클릭하지 않는 문서 묶음
//
// 같은 이름은 전체 경로로 구분
//
// path: 최상위부터 현재 묶음까지
// docs: 현재 단계의 문서
// ----------------------------------------------------------------------------------------
export interface NavigationGroup {
    name: DocData["group"][number];
    path: DocData["group"];
    docs: NavigationDoc[];
    groups: NavigationGroup[];
}

// ----------------------------------------------------------------------------------------
// 서버가 계산한 최소 탐색 자료
//
// 서버 출력과 클라이언트 JSX의 공통 입력
//
// basePath: 서버와 브라우저 탐색이 공유하는 배포 경로
// title: 브랜드 이름
// homePath: 현재 언어 홈의 사이트 경로, 브랜드 링크 대상
// groups: 읽는 순서의 문서 트리
// signature: 페이지별 활성 표시를 제외한 목록의 짧은 식별값, 목록 변경 시 위치 미복원
// outline: 현재 페이지의 목차
// home: README 홈 여부
// cursorFace: 커서 옆 픽셀 얼굴 표시 여부
// ----------------------------------------------------------------------------------------
export interface NavigationData {
    basePath: ResolvedSiteConfig["basePath"];
    title: ResolvedSiteConfig["title"];
    homePath: string;
    groups: NavigationGroup[];
    signature: string;
    outline: TocGroup[];
    home: boolean;
    cursorFace: ResolvedSiteConfig["cursorFace"];
}
