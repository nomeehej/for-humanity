import type {Root} from "hast";
import {visit} from "unist-util-visit";
import type {VFile} from "vfile";
import {copy_warn_broken_anchor} from "@/constant/copy";

// ----------------------------------------------------------------------------------------
// 사이트 주소의 문서 id와 hash 추출 패턴
//
// 홈의 id는 빈 문자열
// ----------------------------------------------------------------------------------------
const site_hash_pattern = /^\/([^?#]*?)\/?(?:\?[^#]*)?#(.+)$/;

// ----------------------------------------------------------------------------------------
// 퍼센트 인코딩 hash의 원문 복원
//
// 해석 실패는 원문 그대로
// ----------------------------------------------------------------------------------------
const toHash = (raw: string): string => {
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
};

// ----------------------------------------------------------------------------------------
// hash 링크의 대상 검사
//
// 대상은 문서 안 요소의 id
// 제목의 자동 id와 원시 HTML에 쓴 id, 번호 링크용으로 제목 안에 둔 `<a id="01"></a>` 포함
// 같은 문서의 `#id`는 id 수집 직후 파일 경고
// 다른 문서의 `/id/#hash`는 fh.anchors에 수집
// read-docs가 전체 수집 뒤 fh.ids와 대조
// 홈, 외부 주소, 문서가 아닌 자원 주소는 제외
// ----------------------------------------------------------------------------------------
export const rehypeAnchors = () => (tree: Root, file: VFile) => {
    const fh = file.data.fh;

    if (fh === undefined) {
        return;
    }

    visit(tree, "element", (node) => {
        if (typeof node.properties.id === "string") {
            fh.ids.add(node.properties.id);
        }
    });

    visit(tree, "element", (node) => {
        const href = node.properties.href;

        if (node.tagName !== "a" || typeof href !== "string") {
            return;
        }

        if (href.startsWith("#")) {
            const hash = toHash(href.slice(1));

            if (hash !== "" && !fh.ids.has(hash)) {
                file.message(`${copy_warn_broken_anchor}: ${href}`, node);
            }

            return;
        }

        const match = site_hash_pattern.exec(href);

        if (match === null || match[1] === "") {
            return;
        }

        fh.anchors.push({id: match[1], hash: toHash(match[2]), line: node.position?.start.line});
    });
};
