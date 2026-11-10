import {locale_doc_group} from "@/component/widget/sidebar/_constant/locale";
import {toNavigationDocs} from "@/component/widget/sidebar/_function/to-navigation-data/_to-navigation-docs";
import type {NavigationGroup} from "@/component/widget/sidebar/_type/navigation-data";
import type {Doc} from "@/type/doc";

// ----------------------------------------------------------------------------------------
// 경로 단계별 문서 묶음의 재귀 입력
//
// docs: 같은 부모 경로에 속한 문서
// children: 검증된 부모 id별 문서, 자손은 각 단계에서 재수집 없음
// path: 부모까지의 경로, 최상위는 빈 배열
// positions: 전체 경로의 JSON 키와 navigation 위치
// unlistedPosition: 미지정 경로의 위치, 지정한 묶음 뒤 배치
// current: 현재 문서 식별자, 홈이면 생략
// ----------------------------------------------------------------------------------------
interface NavigationGroupsParams {
    docs: readonly Doc[];
    children: ReadonlyMap<Doc["data"]["parent"], Doc[]>;
    path: NavigationGroup["path"];
    positions: ReadonlyMap<string, number>;
    unlistedPosition: number;
    current?: string;
}

// ----------------------------------------------------------------------------------------
// 각 단계의 직접 문서와 하위 묶음 분리
//
// 고정된 깊이 제한 없이 구성
// ----------------------------------------------------------------------------------------
export const toNavigationGroups = (params: NavigationGroupsParams): NavigationGroup[] => {
    return [
        ...Map.groupBy(
            params.docs.filter((doc) => doc.data.group.length > params.path.length),
            (doc) => doc.data.group[params.path.length],
        ),
    ]
        .map(([name, docs]) => {
            const path = [...params.path, name];

            return {
                name,
                path,
                docs,
                position: params.positions.get(JSON.stringify(path)) ?? params.unlistedPosition,
            };
        })
        .toSorted((a, b) => a.position - b.position || a.name.localeCompare(b.name, locale_doc_group))
        .map((group) => {
            return {
                name: group.name,
                path: group.path,
                docs: toNavigationDocs({
                    docs: group.docs.filter((doc) => doc.data.group.length === group.path.length && doc.data.parent === undefined),
                    children: params.children,
                    current: params.current,
                }),
                groups: toNavigationGroups({...params, docs: group.docs, path: group.path}),
            };
        });
};
