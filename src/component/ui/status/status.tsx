import clsx from "clsx";
import "./status.css";

// ----------------------------------------------------------------------------------------
// 이미지, 상태 번호, 복귀 경로 입력의 독립 안내 화면
//
// code: 본문 위에 표시할 상태 번호
// title: 상태 번호 설명 제목
// description: 문제와 다음 행동 안내
// image: 장식 이미지 URL, 상태 의미는 제목과 본문으로 전달
// action: 안내 뒤의 복귀 링크
// action.href: 이동 목적지 URL
// action.label: 화면에 표시할 행동 이름
// ----------------------------------------------------------------------------------------
export interface StatusProps {
    code: string;
    title: string;
    description: string;
    image: string;
    action: {
        href: string;
        label: string;
    };
}

export const Status = (props: StatusProps) => {
    // ----------------------------------------------------------------------------------------
    // 화면 구성
    //
    // status__heading: 상태 번호와 읽을 수 있는 오류 제목
    // ----------------------------------------------------------------------------------------
    return (
        <section className={clsx("status__root")}>
            <img className={clsx("status__image")} src={props.image} alt="" />

            <h1 className={clsx("status__heading")}>
                <span className={clsx("status__code")}>{props.code}</span>
                <span className={clsx("status__title")}>{props.title}</span>
            </h1>

            <p className={clsx("status__description")}>{props.description}</p>
            <a className={clsx("status__action")} href={props.action.href}>
                {props.action.label}
            </a>
        </section>
    );
};
