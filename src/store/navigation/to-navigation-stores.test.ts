import {describe, expect, test} from "vitest";
import {storage_scroll_key} from "@/store/navigation/_constant/storage";
import {toNavigationStores} from "@/store/navigation/to-navigation-stores";

// ----------------------------------------------------------------------------------------
// 메모리 기반 세션 저장소 준비
// ----------------------------------------------------------------------------------------
const toMemoryStorage = () => {
    const session = new Map<string, string>();

    const storage = {
        getItem: (key: string) => {
            const value = session.get(key);

            return value === undefined ? null : value;
        },
        setItem: (key: string, value: string) => {
            session.set(key, value);
        },
        removeItem: (key: string) => {
            session.delete(key);
        },
    };

    return {
        session,
        options: {
            session: () => {
                return storage;
            },
        },
    };
};

describe("탐색 스크롤 저장", () => {
    describe("배치별 복원", () => {
        test("와이드, 데스크톱, 드로어의 스크롤 위치를 독립적으로 복원한다", () => {
            const setup = toMemoryStorage();

            const stores = toNavigationStores(setup.options);

            stores.scroll.setState({
                positions: {
                    wide: {navigation: "docs", pathname: "/one/", documents: 450, outline: 300},
                    desktop: {navigation: "docs", pathname: "/two/", documents: 750, outline: 100},
                    drawer: {navigation: "docs", pathname: "/one/", documents: 200, outline: 800},
                },
            });

            const restored = toNavigationStores(setup.options).scroll.getState();

            expect(restored).toStrictEqual(stores.scroll.getState());
        });
    });

    describe("손상된 저장값", () => {
        test.each(["{", "null", '{"state":null,"version":1}'])("손상된 저장값 %s 입력은 기본 상태로 복원한다", (value) => {
            const setup = toMemoryStorage();

            setup.session.set(storage_scroll_key, value);

            const stores = toNavigationStores(setup.options);

            expect(stores.scroll.getState()).toStrictEqual({positions: {}});
        });

        test("잘못된 좌표가 포함된 저장값은 전체를 초기화한다", () => {
            const setup = toMemoryStorage();

            setup.session.set(
                storage_scroll_key,
                JSON.stringify({
                    version: 1,
                    state: {
                        positions: {
                            desktop: {navigation: "docs", pathname: "/one/", documents: -1, outline: 0},
                            wide: {navigation: "docs", pathname: "/one/", documents: 100, outline: 20},
                            drawer: {navigation: "docs", pathname: "/one/", documents: 100, outline: "20"},
                        },
                    },
                }),
            );

            const stores = toNavigationStores(setup.options);

            expect(stores.scroll.getState()).toStrictEqual({positions: {}});
        });
    });

    describe("저장소 오류", () => {
        test("저장소 접근이 차단되어도 메모리의 탐색 상태를 유지한다", () => {
            const stores = toNavigationStores({
                session: () => {
                    throw new Error("Storage blocked");
                },
            });

            stores.scroll.setState({positions: {desktop: {navigation: "docs", pathname: "/", documents: 100, outline: 200}}});

            stores.scroll.persist.rehydrate();

            expect(stores.scroll.getState().positions.desktop).toStrictEqual({navigation: "docs", pathname: "/", documents: 100, outline: 200});
        });

        test("저장 용량이 부족해도 실행 중인 탐색 위치를 유지한다", () => {
            const setup = toMemoryStorage();

            const stores = toNavigationStores({
                session: () => {
                    return {
                        ...setup.options.session(),
                        setItem: () => {
                            throw new DOMException("Storage full", "QuotaExceededError");
                        },
                    };
                },
            });

            stores.scroll.setState({positions: {wide: {navigation: "docs", pathname: "/", documents: 120, outline: 80}}});

            expect(stores.scroll.getState().positions.wide).toStrictEqual({navigation: "docs", pathname: "/", documents: 120, outline: 80});
        });
    });
});
