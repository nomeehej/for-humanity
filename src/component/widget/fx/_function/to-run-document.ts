// ----------------------------------------------------------------------------------------
// 실행 문서 입력
//
// id: 이번 실행의 메시지 id, 부모가 다른 실행과 구분
// code: 사용자가 실행할 코드
// ----------------------------------------------------------------------------------------
interface RunDocumentParams {
    id: string;
    code: string;
}

// ----------------------------------------------------------------------------------------
// 닫는 script 태그 상수
//
// script_close: 닫는 script 태그, browser.js의 페이지 인라인, 소스에 글자 그대로 배치 불가
// script_close_pattern: 사용자 코드의 닫는 script 태그, 대소문자 유지, 슬래시만 이스케이프
// ----------------------------------------------------------------------------------------
const script_close = ["</", "script>"].join("");
const script_close_pattern = /<\/(script)/gi;

// ----------------------------------------------------------------------------------------
// 콘솔의 부모 전달 shim
//
// 사용자 코드의 parent나 id 같은 이름과 충돌 없음, id를 인자로 받는 즉시 실행 함수
// 변환은 문자열 그대로, 함수 이름, 오류 메시지, 그 밖의 값 JSON
// console.log, info, warn, error, 잡히지 않은 오류, 거부의 줄 단위 전달
// 잡히지 않은 오류는 Error 객체 우선 확인
// 브라우저가 이미 붙인 Uncaught는 재추가 없음
// ----------------------------------------------------------------------------------------
const run_shim = [
    "((id)=>{",
    "const target=window.parent;",
    "const show=(v)=>{",
    "if(typeof v==='string')return v;",
    "if(v===null||['undefined','number','bigint','boolean','symbol'].includes(typeof v))return String(v);",
    "if(typeof v==='function')return '[Function '+(v.name||'anonymous')+']';",
    "if(v instanceof Error)return String(v);",
    "try{return JSON.stringify(v)}catch{return String(v)}",
    "};",
    "const send=(...a)=>target.postMessage({id,line:a.map(show).join(' ')},'*');",
    "console.log=console.info=console.warn=console.error=send;",
    "addEventListener('error',(e)=>{const m=e.error==null?e.message:show(e.error);send(m.startsWith('Uncaught')?m:'Uncaught '+m)});",
    "addEventListener('unhandledrejection',(e)=>send('Uncaught (in promise) '+show(e.reason)));",
    "})",
].join("");

// ----------------------------------------------------------------------------------------
// sandbox iframe의 srcdoc
//
// shim 스크립트 다음에 사용자 코드 스크립트
// ----------------------------------------------------------------------------------------
export const toRunDocument = (params: RunDocumentParams): string => {
    return `<script>${run_shim}(${JSON.stringify(params.id)})${script_close}<script>${params.code.replace(script_close_pattern, "<\\/$1")}${script_close}`;
};
