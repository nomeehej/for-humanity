import clsx from "clsx";
import {type DOMAttributes, Fragment, useLayoutEffect, useRef, useState} from "hono/jsx";
import {flushSync} from "hono/jsx/dom";
import {copy_nav_close, copy_nav_open, copy_nav_title} from "@/component/widget/sidebar/_constant/copy";
import {navigation_mobile_query, navigation_wide_query} from "@/component/widget/sidebar/_constant/navigation";
import {DocTree} from "@/component/widget/sidebar/_doc-tree";
import {SidebarScroll} from "@/component/widget/sidebar/_sidebar-scroll";
import {Toc} from "@/component/widget/sidebar/_toc";
import type {NavigationData} from "@/component/widget/sidebar/_type/navigation-data";
import type {NavigationLayout} from "@/store/navigation/navigation-state";
import type {toNavigationStores} from "@/store/navigation/to-navigation-stores";
import {findSameTabLink} from "@/util/dom/find-same-tab-link";
import {toSitePath} from "@/util/url/to-site-path";
import "./sidebar.css";

// ----------------------------------------------------------------------------------------
// 배치 변경에서 Hono가 이전 DOM 자식 분리 전에 기억하는 키보드 위치
//
// navigation: 문서 탐색 안에서 새 배치로 옮길 위치인지 구분
// drawer: 메뉴 진입, 닫기 버튼에서 데스크톱 브랜드로 돌아갈 위치인지 구분
// href: 문서 이동 링크의 안정된 식별자
// ----------------------------------------------------------------------------------------
interface NavigationFocusSnapshot {
    navigation: boolean;
    drawer: boolean;
    href: string | null;
}

// ----------------------------------------------------------------------------------------
// 서버, 브라우저 공통 Hono 탐색 렌더
//
// 서버는 기본 링크로 렌더
// 브라우저는 사용자 저장 상태로 렌더
//
// data: 서버가 정리한 문서 목록과 현재 페이지 목차
// stores: 브라우저 진입점만 제공, 없으면 저장소와 전역 DOM 미조회
// ----------------------------------------------------------------------------------------
export interface SidebarProps {
    data: NavigationData;
    stores?: ReturnType<typeof toNavigationStores>;
}

export const Sidebar = (props: SidebarProps) => {
    const [layout, setLayout] = useState<NavigationLayout>(() => {
        if (props.stores === undefined) {
            return "desktop";
        }

        if (matchMedia(navigation_mobile_query).matches) {
            return "drawer";
        }

        return matchMedia(navigation_wide_query).matches ? "wide" : "desktop";
    });

    const [drawerOpen, setDrawerOpen] = useState(false);
    const documentsRef = useRef<HTMLDivElement | null>(null);
    const drawerDocumentsRef = useRef<HTMLDivElement | null>(null);
    const outlineRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const openButtonRef = useRef<HTMLButtonElement | null>(null);
    const brandRef = useRef<HTMLAnchorElement | null>(null);
    const mobileRef = useRef<MediaQueryList | null>(null);
    const wideRef = useRef<MediaQueryList | null>(null);
    const layoutRef = useRef(layout);
    const focusRef = useRef<NavigationFocusSnapshot | null>(null);
    const restorePendingRef = useRef(true);

    // ----------------------------------------------------------------------------------------
    // 저장된 배치와 현재 CSS 조건 구분
    //
    // 조건 변경 직후 잘린 좌표는 이전 배치에 미저장
    // ----------------------------------------------------------------------------------------
    const getNavigationLayout = (): NavigationLayout => {
        if (mobileRef.current === null || wideRef.current === null) {
            return layoutRef.current;
        }

        if (mobileRef.current.matches) {
            return "drawer";
        }

        return wideRef.current.matches ? "wide" : "desktop";
    };

    // ----------------------------------------------------------------------------------------
    // 배치별 DOM 분리, 좌표 저장과 복원은 현재 표시되는 한 영역 사용
    // ----------------------------------------------------------------------------------------
    const getDocumentsPort = () => {
        return layoutRef.current === "drawer" ? drawerDocumentsRef.current : documentsRef.current;
    };

    // ----------------------------------------------------------------------------------------
    // 모바일 배치에서 모달이 닫혀 문서 목록이 보이지 않는 상태
    // ----------------------------------------------------------------------------------------
    const isDrawerHidden = () => {
        return layoutRef.current === "drawer" && dialogRef.current?.open !== true;
    };

    // ----------------------------------------------------------------------------------------
    // 닫기, 이동보다 먼저 실제 좌표 보존
    //
    // 숨긴 모달과 아직 복원하지 않은 배치는 저장하지 않음
    // ----------------------------------------------------------------------------------------
    const handleScrollSave = () => {
        const documents = getDocumentsPort();

        if (
            props.stores === undefined ||
            documents === null ||
            outlineRef.current === null ||
            restorePendingRef.current ||
            layoutRef.current !== getNavigationLayout() ||
            isDrawerHidden()
        ) {
            return;
        }

        props.stores.scroll.setState({
            positions: {
                ...props.stores.scroll.getState().positions,
                [layoutRef.current]: {
                    navigation: props.data.signature,
                    pathname: location.pathname,
                    documents: documents.scrollTop,
                    outline: outlineRef.current.scrollTop,
                },
            },
        });
    };

    // ----------------------------------------------------------------------------------------
    // 연결된 영역에서 첫 페인트 전 복원
    //
    // 문서 목록은 페이지 간 공유
    // 목차는 같은 경로에서만 재사용
    // ----------------------------------------------------------------------------------------
    const restoreScroll = () => {
        const documents = getDocumentsPort();

        if (props.stores === undefined || documents === null || outlineRef.current === null) {
            return;
        }

        if (isDrawerHidden()) {
            return;
        }

        const position = props.stores.scroll.getState().positions[layoutRef.current];

        if (position?.navigation === props.data.signature) {
            documents.scrollTop = position.documents;
            outlineRef.current.scrollTop = position.pathname === location.pathname ? position.outline : 0;
        } else {
            documents.scrollTop = 0;
            outlineRef.current.scrollTop = 0;
        }

        restorePendingRef.current = false;
        handleScrollSave();

        // 첫 페인트의 넘침 표시 동기화, 비동기 scroll 이벤트 전 반영
        documents.dispatchEvent(new Event("scroll"));
        outlineRef.current.dispatchEvent(new Event("scroll"));
    };

    // ----------------------------------------------------------------------------------------
    // 네이티브 close 이벤트가 이전 열기보다 늦게 도착해도 새 모달의 잠금 유지
    // ----------------------------------------------------------------------------------------
    const handleDrawerClose = (_event: Event) => {
        if (dialogRef.current?.open === true) {
            return;
        }

        document.body.classList.remove("shell__root--drawerOpen");
        setDrawerOpen(false);
    };

    // ----------------------------------------------------------------------------------------
    // 링크의 기본 이동보다 먼저 배경 잠금 해제, 네이티브 포커스 복원 유지
    // ----------------------------------------------------------------------------------------
    const closeNavigation = () => {
        handleScrollSave();
        dialogRef.current?.close();
        document.body.classList.remove("shell__root--drawerOpen");
        setDrawerOpen(false);
    };

    // ----------------------------------------------------------------------------------------
    // 모바일에서만 네이티브 모달 열림, 독립된 드로어 좌표 즉시 복원
    // ----------------------------------------------------------------------------------------
    const handleOpenButtonClick: DOMAttributes["onClick"] = (_event) => {
        if (getNavigationLayout() !== "drawer" || dialogRef.current === null || dialogRef.current.open) {
            return;
        }

        dialogRef.current.showModal();
        document.body.classList.add("shell__root--drawerOpen");
        setDrawerOpen(true);
        restoreScroll();
    };

    const handleCloseButtonClick: DOMAttributes["onClick"] = (_event) => {
        closeNavigation();
    };

    // ----------------------------------------------------------------------------------------
    // Escape의 네이티브 포커스 복원 사용, 좌표는 모달이 닫히기 전에 보존
    // ----------------------------------------------------------------------------------------
    const handleDrawerCancel = (event: Event) => {
        event.preventDefault();
        closeNavigation();
    };

    // ----------------------------------------------------------------------------------------
    // 경계 밖 배경 클릭만 닫힘, 대화상자 내부 빈 공간은 유지
    // ----------------------------------------------------------------------------------------
    const handleDrawerClick: DOMAttributes["onClick"] = (event) => {
        if (dialogRef.current === null || event.target !== dialogRef.current) {
            return;
        }

        const bounds = dialogRef.current.getBoundingClientRect();

        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            closeNavigation();
        }
    };

    // ----------------------------------------------------------------------------------------
    // 보조키, 새 탭 링크는 모달 유지
    //
    // 같은 탭의 기본 이동만 모달 닫기 후 진행
    // ----------------------------------------------------------------------------------------
    const handleNavigationClick: DOMAttributes["onClick"] = (event) => {
        handleScrollSave();

        if (dialogRef.current?.open === true && findSameTabLink(event) !== null) {
            closeNavigation();
        }
    };

    // ----------------------------------------------------------------------------------------
    // 같은 목록은 한 배치에만 렌더
    //
    // 전환 전 포커스 기억, 새 배치 연결 후 좌표 복원
    // ----------------------------------------------------------------------------------------
    const handleLayoutChange = () => {
        const nextLayout = getNavigationLayout();

        if (nextLayout === layoutRef.current) {
            return;
        }

        if (document.activeElement instanceof HTMLElement) {
            focusRef.current = {
                navigation: document.activeElement.closest("[data-sidebar-docs]") !== null,
                drawer: document.activeElement === openButtonRef.current || document.activeElement.closest("[data-sidebar-drawer]") !== null,
                href: document.activeElement.getAttribute("href"),
            };
        }

        if (nextLayout !== "drawer") {
            closeNavigation();
        }

        restorePendingRef.current = true;
        layoutRef.current = nextLayout;
        flushSync(() => setLayout(nextLayout));
    };

    // ----------------------------------------------------------------------------------------
    // BFCache 복귀 시 persist의 최신 저장 좌표 재조회 후 복원
    // ----------------------------------------------------------------------------------------
    const handlePageShow = (event: PageTransitionEvent) => {
        if (!event.persisted || props.stores === undefined) {
            return;
        }

        restorePendingRef.current = true;
        props.stores.scroll.persist.rehydrate();
        handleLayoutChange();
        restoreScroll();
    };

    // ----------------------------------------------------------------------------------------
    // 전역 구독의 설치, 정리는 Hono 탐색이 소유
    //
    // 서버 렌더에서는 실행하지 않음
    // ----------------------------------------------------------------------------------------
    useLayoutEffect(() => {
        if (props.stores === undefined) {
            return;
        }

        mobileRef.current = matchMedia(navigation_mobile_query);
        wideRef.current = matchMedia(navigation_wide_query);
        mobileRef.current.addEventListener("change", handleLayoutChange);
        wideRef.current.addEventListener("change", handleLayoutChange);
        addEventListener("pagehide", handleScrollSave);
        addEventListener("pageshow", handlePageShow);

        return () => {
            mobileRef.current?.removeEventListener("change", handleLayoutChange);
            wideRef.current?.removeEventListener("change", handleLayoutChange);
            mobileRef.current = null;
            wideRef.current = null;
            removeEventListener("pagehide", handleScrollSave);
            removeEventListener("pageshow", handlePageShow);
            document.body.classList.remove("shell__root--drawerOpen");
        };
    }, [props.stores]);

    // ----------------------------------------------------------------------------------------
    // 최초 마운트와 반응형 재연결의 페인트 전 좌표, 포커스 복원
    //
    // Hono의 프래그먼트 연결 시점 보정
    // ----------------------------------------------------------------------------------------
    useLayoutEffect(() => {
        if (props.stores === undefined) {
            return;
        }

        let active = true;

        // ----------------------------------------------------------------------------------------
        // 연결된 배치의 좌표 복원 후 전환 전 포커스 이동
        //
        // 대상은 같은 링크, 진입 버튼, 브랜드
        // ----------------------------------------------------------------------------------------
        const restoreNavigation = () => {
            if (!active) {
                return;
            }

            restoreScroll();

            if (focusRef.current === null) {
                return;
            }

            const documents = getDocumentsPort();

            if (layout === "drawer") {
                if (focusRef.current.navigation) {
                    openButtonRef.current?.focus({preventScroll: true});
                }
            } else if (focusRef.current.navigation && documents !== null) {
                [...documents.querySelectorAll<HTMLElement>("a[href]")].find((element) => element.getAttribute("href") === focusRef.current?.href)?.focus({preventScroll: true});
            } else if (focusRef.current.drawer) {
                brandRef.current?.focus({preventScroll: true});
            }

            focusRef.current = null;
        };

        if (getDocumentsPort()?.isConnected) {
            restoreNavigation();
        } else {
            // Hono 최초 레이아웃 효과는 분리된 프래그먼트에서 실행, DOM 연결 후 첫 페인트 전 보정
            queueMicrotask(restoreNavigation);
        }

        return () => {
            active = false;
        };
    }, [layout, props.stores]);

    // ----------------------------------------------------------------------------------------
    // 화면 구성
    //
    // sidebar__docsColumn: 데스크톱 문서 사이드바,
    //   모바일에서는 고정 브랜드와 연결된 메뉴 버튼
    // sidebar__brandRow: 배너 랜드마크, 어느 문서에서도 홈으로 이동,
    //   모달 진입은 브라우저 동작이 연결된 뒤 표시
    // sidebar__brand: 사이트 이름, 현재 언어의 홈으로 이동,
    //   홈 문서에서는 현재 페이지로 표시
    // sidebar__menuToggle: 네이티브 모달의 열림 상태와 접근 가능한 진입 이름
    // sidebar__docsPanel: JavaScript 없이도 전체 문서 링크 표시,
    //   브라우저 모바일에서는 드로어가 같은 목록 소유
    // sidebar__tocColumn: 와이드 화면 전용 목차, 드로어에는 문서 목록만 표시
    // sidebar__drawer: 브라우저 최상위 레이어의 포커스, Escape,
    //   배경 클릭 동작과 모바일 문서 목록
    // sidebar__drawerHeader: 목록 스크롤과 독립된 대화상자 이름, 닫기 동작
    // sidebar__drawerTitle: 모달의 접근 가능한 이름
    // sidebar__drawerClose: 네이티브 close로 열기 버튼에 포커스 복원
    // sidebar__drawerContent: 모바일에만 한 번 렌더하는 문서 탐색,
    //   다른 배치와 저장 좌표 분리
    // ----------------------------------------------------------------------------------------
    return (
        <Fragment>
            <div className={clsx("sidebar__docsColumn", props.stores !== undefined && "sidebar__docsColumn--ready")}>
                <header className={clsx("sidebar__brandRow")}>
                    <a
                        ref={props.stores === undefined ? undefined : brandRef}
                        className={clsx("sidebar__brand")}
                        href={toSitePath({basePath: props.data.basePath, path: props.data.homePath})}
                        aria-current={props.data.home ? "page" : undefined}
                    >
                        {props.data.title}
                    </a>

                    <button
                        ref={props.stores === undefined ? undefined : openButtonRef}
                        className={clsx("sidebar__menuToggle", props.stores !== undefined && layout === "drawer" && "sidebar__menuToggle--visible")}
                        type="button"
                        aria-label={copy_nav_open}
                        aria-controls="fh-navigation-drawer"
                        aria-expanded={String(drawerOpen)}
                        onClick={handleOpenButtonClick}
                    >
                        <svg className={clsx("sidebar__menuIcon")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {layout !== "drawer" && (
                    <div className={clsx("sidebar__docsPanel")} data-sidebar-docs="" data-sidebar-layout={layout}>
                        <SidebarScroll portRef={documentsRef} kind="documents" ready={props.stores !== undefined} onScroll={handleScrollSave} onClick={handleNavigationClick}>
                            <DocTree groups={props.data.groups} basePath={props.data.basePath} />
                        </SidebarScroll>
                    </div>
                )}
            </div>

            <aside className={clsx("sidebar__tocColumn", props.data.outline.length === 0 && "sidebar__tocColumn--empty")} data-sidebar-toc="">
                <SidebarScroll portRef={outlineRef} kind="outline" ready={props.stores !== undefined} onScroll={handleScrollSave} onClick={handleNavigationClick}>
                    {props.data.outline.length > 0 && <Toc groups={props.data.outline} />}
                </SidebarScroll>
            </aside>

            {/* biome-ignore lint/a11y/useKeyWithClickEvents: 배경 클릭의 키보드 대안은 네이티브 dialog의 cancel과 닫기 버튼 */}
            <dialog
                ref={props.stores === undefined ? undefined : dialogRef}
                className={clsx("sidebar__drawer")}
                id="fh-navigation-drawer"
                aria-labelledby="fh-navigation-title"
                data-sidebar-drawer=""
                onClose={handleDrawerClose}
                onCancel={handleDrawerCancel}
                onClick={handleDrawerClick}
            >
                <div className={clsx("sidebar__drawerHeader")}>
                    <h2 className={clsx("sidebar__drawerTitle")} id="fh-navigation-title">
                        {copy_nav_title}
                    </h2>

                    <button className={clsx("sidebar__drawerClose")} type="button" aria-label={copy_nav_close} onClick={handleCloseButtonClick}>
                        <svg className={clsx("sidebar__menuIcon")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="m6 6 12 12M18 6 6 18" />
                        </svg>
                    </button>
                </div>

                <div className={clsx("sidebar__drawerContent")}>
                    {layout === "drawer" && (
                        <div className={clsx("sidebar__docsPanel")} data-sidebar-docs="" data-sidebar-layout={layout}>
                            <SidebarScroll
                                portRef={drawerDocumentsRef}
                                kind="documents"
                                ready={props.stores !== undefined}
                                onScroll={handleScrollSave}
                                onClick={handleNavigationClick}
                            >
                                <DocTree groups={props.data.groups} basePath={props.data.basePath} />
                            </SidebarScroll>
                        </div>
                    )}
                </div>
            </dialog>
        </Fragment>
    );
};
