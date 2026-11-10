---
name: Site deployment
label: 공식 문서 사이트의 Cloudflare Workers 운영
group: Development
order: 20
---

공식 문서 사이트는 Cloudflare Workers Static Assets로 `content/dist`를 배포합니다.
공개 주소는 [for-humanity.fyi](https://for-humanity.fyi)이며, 실행 중인 Node.js 서버나 Worker 스크립트는 필요하지 않습니다.
설정은 저장소 루트의 `wrangler.jsonc`, 빌드와 배포 명령은 `package.json`에서 관리합니다.

## Build and deploy

```sh
pnpm build:site
pnpm preview

# 최초 로컬 배포 전 계정 연결
pnpm exec wrangler login
pnpm deploy:site
```

`build:site`는 패키지와 공개 문서, 공통 `404.html`을 빌드한 뒤 `.cloudflare/_headers`를 `content/dist`에 복사합니다.
`deploy:site`는 같은 빌드 후 `wrangler deploy`를 실행합니다. 원본 `content` 전체를 업로드하지 않습니다.
문서 루트와 공개 범위는 [Content layout](content-layout.md), 패키지 공개 절차는 [Maintenance](maintenance.md#packaging-and-release)를 참고합니다.

| Configuration | Value |
| --- | --- |
| Worker name | `for-humanity` |
| Static assets | `content/dist` |
| HTML paths | `force-trailing-slash` |
| Missing paths | `404-page` |
| Node.js | `.node-version` |
| pnpm | `package.json`의 `packageManager` |

`assets.html_handling`은 `/guide/` 형태의 문서 주소로 정규화합니다.
`assets.not_found_handling`과 출력의 `404.html`은 없는 문서와 내부 문서 경로에 404 응답을 반환합니다.
Worker 진입점, Node.js 호환 플래그, SPA fallback은 사용하지 않습니다.
설정 기준은 [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)와 [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)입니다.

## Workers Builds

Workers의 Builds에 저장소를 연결하고 다음 값을 지정합니다.

| Setting | Value |
| --- | --- |
| Repository | `nomeehej/for-humanity` |
| Production branch | `main` |
| Root directory | 저장소 루트 |
| Build command | `pnpm build:site` |
| Deploy command | `pnpm exec wrangler deploy` |
| Preview command | `pnpm exec wrangler preview` |
| `PNPM_VERSION` | `12.9.1` |

`main` push로 공식 사이트를 갱신합니다. GitHub Actions의 CI도 `build:site`를 실행하며, npm과 GitHub Release는 버전 태그가 있어야 공개합니다.
다른 브랜치는 같은 빌드 후 `wrangler preview`로 미리보기를 배포합니다. `wrangler.jsonc`의 `previews`와 `preview_urls`는 미리보기 배포를 허용하며 공식 도메인은 운영 Worker에만 연결합니다.
빌드 명령과 배포 명령을 분리해 Workers Builds에서 중복 빌드를 피합니다.
연결 절차는 [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), 빌드 환경은 [Build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)를 참고합니다.

## Headers

| File | Purpose |
| --- | --- |
| `.cloudflare/_headers` | HTML 재검증과 원문 보존, 내용 지문이 붙은 자원의 장기 캐시 |
| `content/dist/404.html` | 패키지 빌드가 생성한 상태 화면, 별도 원본 복사 없음 |
| `util/prepare-site.ts` | 빌드 후 헤더를 출력 폴더에 복사 |

HTML에는 `public, max-age=0, must-revalidate, no-transform`, `/_fh/*`에는 `public, max-age=31536000, immutable`을 적용합니다.
내용 지문이 붙은 자원은 내용 변경 시 URL도 바뀝니다. `_headers`는 Workers 정적 자산에서 직접 해석합니다.
헤더 계약은 [Headers](https://developers.cloudflare.com/workers/static-assets/headers/)를 참고합니다.
로컬 `preview`도 없는 문서에 생성된 화면과 HTTP 404를 반환합니다. 플랫폼의 경로 정규화와 헤더는 `wrangler dev` 또는 배포 주소에서 확인합니다.
상태 화면 이미지는 `statusImage`로 교체합니다. 기본 이미지는 favicon의 얼굴과 같은 색, 윤곽, 눈을 유지한 슬픈 표정이며 favicon과 커서 이미지는 유지합니다.

## Pages migration

1. `pnpm build:site`와 `pnpm exec wrangler deploy --dry-run`으로 자산과 설정을 확인합니다.
2. 새 Worker를 배포하고 기본 `workers.dev` 주소에서 홈, 개별 문서, Mermaid, 이미지, 404와 헤더를 확인합니다.
3. 기존 Pages의 `for-humanity.fyi` 연결을 해제하고 Worker Custom Domain으로 연결합니다. Pages를 가리키는 기존 CNAME이 남아 `100117` 오류가 발생하면 그 CNAME만 제거한 뒤 연결합니다. 다른 TXT 등 DNS 레코드는 유지합니다. 공식 도메인은 `wrangler.jsonc`의 `routes`에서 관리합니다.
4. 공식 도메인의 HTTPS와 문서 경로, `/robots.txt`, `/sitemap.xml`, private 경로의 404를 확인합니다.
5. 기존 Pages 프로젝트의 자동 배포를 중단합니다. 이전 `for-humanity-1i2.pages.dev` 주소는 Worker 주소로 자동 이전되지 않습니다.

운영 전환이 검증되기 전에는 Pages 프로젝트를 삭제하지 않습니다.
문서 설정의 `url`은 계속 `https://for-humanity.fyi`를 사용합니다.
공식 절차는 [Migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)를 참고합니다.

## Private site

내부 문서까지 담은 내부판은 두 번째 Worker `for-humanity-private`으로 배포합니다. 설정은 저장소 루트의 `wrangler.private.jsonc`이고 자산 폴더는 `content/dist-private`입니다.
공식 저장소는 공개라서 내부판을 잠가도 원본은 GitHub에서 읽힙니다. 이 Worker는 내부판 배포와 Cloudflare Access 절차를 실제로 확인하는 용도입니다.

```sh
pnpm build:private
pnpm preview:private
pnpm deploy:private
```

| Configuration | Value |
| --- | --- |
| Worker name | `for-humanity-private` |
| Static assets | `content/dist-private` |
| `workers_dev`, `preview_urls` | Access를 켜기 전에는 `false`. 2026-11-10에 Access를 켠 뒤 `true`로 변경 |
| Build command | `pnpm build:private` |
| Deploy command | `pnpm exec wrangler deploy --config wrangler.private.jsonc` |

2026-11-10에 주소 없이 처음 배포했습니다. 배포 뒤 `workers.dev` 주소와 버전 주소가 모두 404인 것을 확인했습니다. 캐시 헤더 파일은 두지 않습니다. 내부판은 독자가 적어 Workers 정적 자산의 기본 재검증으로 충분합니다.

### Access checks

Access를 켜고 주소를 여는 순서입니다. 화면의 항목은 [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)를 따릅니다.

1. 대시보드의 Workers & Pages에서 `for-humanity-private`을 열고 Access 탭에서 보호를 켭니다. 허용할 이메일을 정책에 넣습니다.
2. `wrangler.private.jsonc`의 `workers_dev`를 `true`로 바꾸거나 `routes`에 Custom Domain을 추가한 뒤 `pnpm deploy:private`을 실행합니다. 주소는 대시보드가 아니라 설정 파일에서 엽니다. 다음 배포가 설정 파일의 값으로 덮어쓰기 때문입니다.
3. 아래 항목을 확인하고 결과를 [Server design](server-design.md#구현-첫-단계에서-확인할-것)에 적습니다.

- [x] 주소가 없는 Worker에서 Access를 켤 수 있는지. 2026-11-10에 주소 없이 배포한 상태에서 켰습니다.
- [x] 로그인 없는 요청에 `workers.dev`와 버전 주소가 모두 로그인을 요구하는지. 2026-11-10에 두 주소의 홈과 내부 문서가 Access 로그인 주소로 302 이동했습니다. 인코딩한 경로, 겹친 슬래시, 대소문자가 다른 경로도 같았습니다.
- [x] `/_fh/` 아래 CSS 주소와 `404.html`을 직접 열어도 로그인을 요구하는지. 같은 날 302 이동을 확인했습니다.
- [ ] Custom Domain을 연결한 뒤에도 로그인을 요구하는지
- [ ] 허용한 이메일로 로그인하면 공개 문서와 내부 문서가 함께 보이는지
- [ ] 무료 요금제가 허용하는 사용자 수

확인이 끝나면 공개 문서 [Deployment](../public/deployment.md#private-site)에 순서를 적습니다.

## Other projects

설치 사용자의 배포 방법은 [Deployment](../public/deployment.md)를 참고합니다.
정적 호스팅에는 생성된 문서 루트 아래의 `dist` 전체를 배포합니다. `basePath`로 GitHub Pages의 저장소별 경로도 지원합니다.
공식 사이트의 배포 설정과 패키지 사용자의 초기화 파일은 각각 관리합니다.
