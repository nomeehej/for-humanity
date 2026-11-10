import clsx from "clsx";
import type {NavigationData, NavigationGroup} from "@/component/widget/sidebar/_type/navigation-data";
import {toPagePath} from "@/util/url/to-page-path";
import {toSitePath} from "@/util/url/to-site-path";
import "./_doc-list.css";

// ----------------------------------------------------------------------------------------
// 한 단계의 문서 목록과 하위 묶음
//
// 재귀에서도 같은 탐색 표현 유지
//
// group: 현재 단계의 문서와 하위 묶음
// basePath: 재귀 목록 전체에 적용할 배포 경로
// ----------------------------------------------------------------------------------------
export interface DocListProps {
    group: NavigationGroup;
    basePath: NavigationData["basePath"];
}

export const DocList = (props: DocListProps) => {
    // ----------------------------------------------------------------------------------------
    // 화면 구성
    //
    // docList__link: 문서 링크, 부모도 원래 파일 URL의 독립 페이지,
    //   현재 한 문서에만 페이지 상태 부여
    // DocList: 하위 문서, 부모 아래에서도 기존 목록의 들여쓰기와 키보드 이동 유지
    // docList__branch: 하위 묶음, 같은 목록의 재귀 렌더, 깊이별 들여쓰기
    // ----------------------------------------------------------------------------------------
    return (
        <ul className={clsx("docList__root")} aria-label={props.group.name}>
            {props.group.docs.map((doc) => {
                return (
                    <li className={clsx("docList__item")} key={`doc:${doc.id}`}>
                        <a
                            className={clsx("docList__link", doc.active && "docList__link--active")}
                            href={toSitePath({basePath: props.basePath, path: toPagePath(doc.id)})}
                            title={doc.label}
                            aria-current={doc.active ? "page" : undefined}
                        >
                            {doc.name}
                        </a>

                        {doc.children.length > 0 && <DocList group={{name: doc.name, path: props.group.path, docs: doc.children, groups: []}} basePath={props.basePath} />}
                    </li>
                );
            })}

            {props.group.groups.map((group) => {
                return (
                    <li className={clsx("docList__item")} key={`group:${JSON.stringify(group.path)}`}>
                        <span className={clsx("docList__branch")}>{group.name}</span>
                        <DocList group={group} basePath={props.basePath} />
                    </li>
                );
            })}
        </ul>
    );
};
