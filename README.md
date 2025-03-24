# 아카이빙봇 백엔드

- Node, Hono
- Cloudflare D1 (SQLite), Cloudflare Workers, AWS S3

## 실행

### 1. 패키지 설치

```
corepack enable
pnpm i
pnpm dev
```

### 2. wrangler.toml 파일 설정

프로젝트에서 실행할 wrangler 환경을 설정해요.
유어슈 Vault를 참고해주세요.

### 3. 로컬 DB 생성

`drizzle/migrations` 경로에서 가장 최신 마이그레이션 파일로 로컬에 DB를 만들어주세요.

```
pnpm migrate:local <최신_마이그레이션_파일_경로>
```

---

## 스키마 업데이트

`src/db/schema.ts` 변경 후, 아래 방법으로 마이그레이션 파일을 생성해주세요.

```
pnpm db:gen
```

### 로컬 DB 마이그레이션

```
pnpm migrate:local
```

### 프로덕션 DB 마이그레이션

필요시에만 사용해주세요.

```
pnpm migrate:remote
```

---

## Workers 배포

```
pnpm run deploy
```
