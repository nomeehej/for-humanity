import {describe, expect, test} from "vitest";
import {toCellComparator} from "@/component/widget/table-sort/_function/compare-cell-text";

// ----------------------------------------------------------------------------------------
// 칸 글 비교(src/component/widget/table-sort/_function/compare-cell-text.ts) 검증
// ----------------------------------------------------------------------------------------
describe("표 정렬", () => {
    describe("칸 글 비교", () => {
        test("숫자가 든 글은 자릿수가 아니라 값 순서로 정렬한다", () => {
            const compare = toCellComparator("ko");
            const texts = ["10", "2", "1", "3년 이상", "10년 이상"];

            const sorted = [...texts].sort((a, b) => compare(a, b));

            expect(sorted).toEqual(["1", "2", "3년 이상", "10", "10년 이상"]);
        });

        test("날짜는 오름차순과 내림차순으로 정렬한다", () => {
            const compare = toCellComparator("ko");
            const texts = ["2027-10-22", "2026-10-29", "2026-11-01"];

            const ascending = [...texts].sort((a, b) => compare(a, b));
            const descending = [...texts].sort((a, b) => compare(a, b, true));

            expect(ascending).toEqual(["2026-10-29", "2026-11-01", "2027-10-22"]);
            expect(descending).toEqual(["2027-10-22", "2026-11-01", "2026-10-29"]);
        });

        test.each([
            {direction: "오름차순", descending: false, expected: ["a", "b", "-", ""]},
            {direction: "내림차순", descending: true, expected: ["b", "a", "-", ""]},
        ])("빈 칸과 -는 $direction 에서도 쓴 순서대로 끝에 남는다", (scenario) => {
            const compare = toCellComparator("ko");
            const texts = ["-", "b", "", "a"];

            const sorted = [...texts].sort((a, b) => compare(a, b, scenario.descending));

            expect(sorted).toEqual(scenario.expected);
        });

        test("앞뒤 공백과 대소문자는 비교에서 제외한다", () => {
            const compare = toCellComparator("en");
            const texts = ["B", " a ", "A"];

            const sorted = [...texts].sort((a, b) => compare(a, b));

            expect(sorted).toEqual([" a ", "A", "B"]);
        });

        test.each([{locale: ""}, {locale: "not a locale"}, {locale: undefined}])("언어 태그 $locale 는 기본 사전 순서로 대신한다", (scenario) => {
            const compare = toCellComparator(scenario.locale);

            const sorted = ["나", "b", "가", "a"].sort((a, b) => compare(a, b));

            expect(sorted).toEqual(["a", "b", "가", "나"]);
        });
    });
});
