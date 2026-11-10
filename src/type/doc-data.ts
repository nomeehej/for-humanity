import {z} from "zod";
import {copy_error_doc_date, copy_error_doc_revised} from "@/constant/copy";
import {doc_date_month_pattern, doc_order_default, doc_type} from "@/constant/doc";
import {groupPathSchema} from "@/type/group-path";

// ----------------------------------------------------------------------------------------
// 작성자가 적은 문서 날짜
//
// 달까지 또는 실제 있는 날까지, 적은 그대로 표시
// ----------------------------------------------------------------------------------------
const docDateSchema = z.union([z.iso.date(), z.string().regex(doc_date_month_pattern)], {error: copy_error_doc_date});

// ----------------------------------------------------------------------------------------
// 문서 frontmatter 스키마
//
// 검증 실패 시 빌드 중단
//
// name: 문서 이름, 제목과 목록에 표시, 같은 첫 글자 허용
// label: 짧은 문서 설명, 사이드바 툴팁, 문서 페이지의 설명 메타데이터
// type: 기존 type 값 호환, 생략 권장, 렌더링 차이 없음
// group: 사이드바의 문서 묶음 경로, 문자열도 배열로 정규화
// parent: 같은 묶음 안의 부모 문서 id, 확장자 제외, ./, ../ 상대 경로도 허용
// order: 묶음 안의 읽는 순서, 미지정 문서는 뒤에서 이름순
// created: 처음 작성한 날짜, 제목 아래 표시
// revised: 다시 정리한 날짜, 제목 아래 표시, 날까지 적으면 사이트맵 lastmod
// ----------------------------------------------------------------------------------------
export const docDataSchema = z
    .object({
        name: z.string().trim().min(1),
        label: z.string(),
        type: z.enum(doc_type).default(doc_type.document),
        group: groupPathSchema,
        parent: z.string().trim().min(1).optional(),
        order: z.number().int().nonnegative().default(doc_order_default),
        created: docDateSchema.optional(),
        revised: docDateSchema.optional(),
    })
    // 정밀도가 다른 두 날짜는 짧은 쪽 길이까지 비교. 2026-10과 2026-10-05는 같은 달
    .refine(
        (data) => {
            if (data.created === undefined || data.revised === undefined) {
                return true;
            }

            const length = Math.min(data.created.length, data.revised.length);

            return data.revised.slice(0, length) >= data.created.slice(0, length);
        },
        {path: ["revised"], error: copy_error_doc_revised},
    );

// ----------------------------------------------------------------------------------------
// 기본값을 적용한 문서 frontmatter
// ----------------------------------------------------------------------------------------
export type DocData = z.infer<typeof docDataSchema>;
