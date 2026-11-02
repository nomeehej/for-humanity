import {mergeTests} from "@playwright/test";
import {test as dev} from "@test/_fixture/dev";
import {test as docs} from "@test/_fixture/docs";
import {test as fx} from "@test/_fixture/fx";
import {test as mermaid} from "@test/_fixture/mermaid";
import {test as navigation} from "@test/_fixture/navigation";
import {test as tableSort} from "@test/_fixture/table-sort";

/**
 * 모든 사이트 fixture를 한 풀로 합친 테스트. 브라우저 사양 파일은 이 test를 사용
 *
 *   - Playwright는 worker fixture 목록이 같은 테스트만 같은 워커에서 이어 실행. 모듈별 test를 쓰면 파일이 바뀔 때마다 워커를 새로 띄우고 사이트를 다시 빌드
 *   - 사이트는 처음 쓰는 테스트에서만 빌드. baseURL은 사양 파일이 쓰는 사이트로 test.use에서 지정
 */
export const test = mergeTests(dev, docs, fx, mermaid, navigation, tableSort);
