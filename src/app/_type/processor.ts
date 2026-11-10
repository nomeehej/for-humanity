import type {toProcessor} from "@/app/_function/to-processor/to-processor";

// ----------------------------------------------------------------------------------------
// 플러그인 조립을 마친 Markdown 처리기
//
// 문서 조회와 홈 조회 공용
// ----------------------------------------------------------------------------------------
export type Processor = ReturnType<typeof toProcessor>;
