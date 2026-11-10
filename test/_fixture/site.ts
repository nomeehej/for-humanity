import {mergeTests} from "@playwright/test";
import {test as dev} from "@test/_fixture/dev";
import {test as docs} from "@test/_fixture/docs";
import {test as fx} from "@test/_fixture/fx";
import {test as mermaid} from "@test/_fixture/mermaid";
import {test as navigation} from "@test/_fixture/navigation";
import {test as tableSort} from "@test/_fixture/table-sort";

// ----------------------------------------------------------------------------------------
// 모든 사이트 fixture를 한 풀로 합친 테스트
//
// 브라우저 사양 파일 공통 사용
// Playwright는 worker fixture 목록이 같은 테스트만 같은 워커에서 이어 실행
// 모듈별 test 사용 시 사양 파일마다 워커 재시작과 사이트 재빌드
// 사이트는 워커가 처음 사용하는 테스트에서 한 번 빌드
// baseURL은 각 사양 파일의 test.use에서 지정
// ----------------------------------------------------------------------------------------
export const test = mergeTests(dev, docs, fx, mermaid, navigation, tableSort);
