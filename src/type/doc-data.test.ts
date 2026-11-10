import {describe, expect, test} from "vitest";
import {docDataSchema} from "@/type/doc-data";

describe("문서 메타", () => {
    describe("묶음 이름", () => {
        test("묶음 이름은 공백을 정리하고 문장부호를 보존한다", () => {
            const groups = [" Guide ", [" Projects ", "Example project", "Research"], "Research, decisions / notes"];

            const result = groups.map((group) => docDataSchema.parse({name: "Guide", label: "Guide", group}).group);

            expect(result).toStrictEqual([["Guide"], ["Projects", "Example project", "Research"], ["Research, decisions / notes"]]);
        });

        test.each(["", " ", [], ["Projects", " "], ["Projects", 1], [["Projects"]], null].map((group) => ({group})))("잘못된 묶음 $group 입력은 거부한다", (scenario) => {
            const result = docDataSchema.safeParse({name: "Guide", label: "Guide", group: scenario.group});

            expect(result.success).toBe(false);
        });
    });

    describe("부모 식별자", () => {
        test("부모는 생략 가능하며 지정한 식별자의 공백을 정리한다", () => {
            const data = {name: "Child", label: "Child", group: "Guide"};

            const result = {absent: docDataSchema.parse(data).parent, present: docDataSchema.parse({...data, parent: " guide/settings "}).parent};

            expect(result).toStrictEqual({absent: undefined, present: "guide/settings"});
        });

        test.each(["", " ", null, 1, [], ["guide"]].map((parent) => ({parent})))("잘못된 부모 $parent 입력은 거부한다", (scenario) => {
            const result = docDataSchema.safeParse({name: "Child", label: "Child", group: "Guide", parent: scenario.parent});

            expect(result.success).toBe(false);
        });
    });

    describe("작성 날짜", () => {
        test("날짜는 생략할 수 있고 달까지나 날까지 적은 값을 그대로 유지한다", () => {
            const data = {name: "Post", label: "Post", group: "Posts"};

            const result = [
                docDataSchema.parse(data),
                docDataSchema.parse({...data, created: "2022-12", revised: "2026-10"}),
                docDataSchema.parse({...data, created: "2024-02-29"}),
                docDataSchema.parse({...data, created: "2026-10-05", revised: "2026-10"}),
            ].map((parsed) => ({created: parsed.created, revised: parsed.revised}));

            expect(result).toStrictEqual([
                {created: undefined, revised: undefined},
                {created: "2022-12", revised: "2026-10"},
                {created: "2024-02-29", revised: undefined},
                {created: "2026-10-05", revised: "2026-10"},
            ]);
        });

        test.each(["2026", "2026-13", "2026-1", "2026/10", "2026-02-30", "2026-10-05T10:00", 2026, null].map((created) => ({created})))(
            "잘못된 날짜 $created 입력은 거부한다",
            (scenario) => {
                const result = docDataSchema.safeParse({name: "Post", label: "Post", group: "Posts", created: scenario.created});

                expect(result.error?.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`)).toStrictEqual(["created must be YYYY-MM or YYYY-MM-DD"]);
            },
        );

        test.each([
            {created: "2026-10", revised: "2026-09"},
            {created: "2026-10-05", revised: "2026-10-04"},
            {created: "2026-10-05", revised: "2026-09-30"},
        ])("다시 정리한 날짜 $revised 값이 처음 작성한 날짜보다 앞서면 거부한다", (scenario) => {
            const result = docDataSchema.safeParse({name: "Post", label: "Post", group: "Posts", ...scenario});

            expect(result.error?.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`)).toStrictEqual(["revised must not be earlier than created"]);
        });
    });
});
