import {z} from "zod";

// ----------------------------------------------------------------------------------------
// 공개 버전과 설치 결과 검증에 필요한 패키지 정보
//
// name: npm 패키지 이름
// version: 설치 또는 공개할 버전
// homepage: 릴리스 안내에 사용할 문서 사이트
// dependencies: 설치 패키지의 실행 의존성
// ----------------------------------------------------------------------------------------
export const packageMetadataSchema = z.object({
    name: z.string(),
    version: z.string(),
    homepage: z.url(),
    dependencies: z.record(z.string(), z.string()).optional(),
});
