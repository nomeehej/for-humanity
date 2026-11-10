import {z} from "zod";

// ----------------------------------------------------------------------------------------
// npm pack 결과의 배포 검증 필드
//
// filename: 생성된 압축 파일 이름
// integrity: npm 레지스트리와 비교할 내용 무결성 값
// files: 패키지에 포함된 상대 경로 목록
// ----------------------------------------------------------------------------------------
const packSchema = z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    filename: z.string().min(1),
    integrity: z.string().min(1),
    files: z.array(z.object({path: z.string()})),
});

// ----------------------------------------------------------------------------------------
// npm pack 보고서의 단일 산출물
//
// npm 버전에 따라 배열 또는 패키지 이름 키 객체 출력
// ----------------------------------------------------------------------------------------
export const packReportSchema = z
    .union([z.array(packSchema), z.record(z.string(), packSchema)])
    .transform((report) => Object.values(report))
    .pipe(z.array(packSchema).length(1))
    .transform((reports) => reports[0]);
