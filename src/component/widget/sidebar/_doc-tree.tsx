import clsx from "clsx";
import {copy_nav_aria_label} from "@/component/widget/sidebar/_constant/copy";
import {DocList} from "@/component/widget/sidebar/_doc-list";
import type {NavigationData, NavigationGroup} from "@/component/widget/sidebar/_type/navigation-data";
import "./_doc-tree.css";

// ----------------------------------------------------------------------------------------
// 서버, 브라우저가 공유하는 문서 트리
//
// groups: 본문 제외, 읽는 순서의 문서 묶음
// basePath: 트리 전체에 적용할 배포 경로
// ----------------------------------------------------------------------------------------
export interface DocTreeProps {
    groups: NavigationGroup[];
    basePath: NavigationData["basePath"];
}

export const DocTree = (props: DocTreeProps) => {
    // ----------------------------------------------------------------------------------------
    // 화면 구성
    //
    // docTree__docGroup: 문서 이동, 클릭하지 않는 묶음과 독립 문서
    // ----------------------------------------------------------------------------------------
    return (
        <nav className={clsx("docTree__root")} aria-label={copy_nav_aria_label}>
            {props.groups.map((group) => {
                return (
                    <section className={clsx("docTree__docGroup")} key={JSON.stringify(group.path)} aria-label={group.name}>
                        <div className={clsx("docTree__group")}>{group.name}</div>
                        <DocList group={group} basePath={props.basePath} />
                    </section>
                );
            })}
        </nav>
    );
};
