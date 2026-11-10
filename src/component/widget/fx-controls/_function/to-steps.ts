import {range} from "es-toolkit/math";

// ----------------------------------------------------------------------------------------
// 단계 표기 패턴
//
// 앞 숫자가 없는 구간은 1부터 시작
// 뒤 숫자가 없는 구간은 끝까지 포함
//
// range_pattern: 구간 표기
// step_pattern: 숫자만으로 된 단계 하나의 표기
// ----------------------------------------------------------------------------------------
const range_pattern = /^(\d*)-(\d*)$/;
const step_pattern = /^\d+$/;

// ----------------------------------------------------------------------------------------
// 공백으로 이은 "3", "2-5", "4-", "-2" 표기에서 켜질 단계 집합
//
// 숫자만으로 된 조각이 아니면 무시
//
// count: 전체 단계 수, "4-"의 끝이자 구간 끝의 상한
// ----------------------------------------------------------------------------------------
export const toSteps = (spec: string, count: number): Set<number> => {
    return new Set(
        spec
            .split(/\s+/)
            .filter((part) => part !== "")
            .flatMap((part) => {
                const match = range_pattern.exec(part);

                if (match === null) {
                    return step_pattern.test(part) ? [Number(part)] : [];
                }

                return range(match[1] === "" ? 1 : Number(match[1]), (match[2] === "" ? count : Math.min(Number(match[2]), count)) + 1);
            }),
    );
};
