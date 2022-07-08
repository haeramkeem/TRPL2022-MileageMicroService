# 트리플 공개 채용 2022 입사과제

## For demo

- 전제조건: `nodejs`, 와 `npm`, `docker` 가 설치되어 있어야 합니다.

```bash
npm run start:prod
```

## Testing scripts

- 테스트를 위해 준비한 스크립트는 [test/](./test) 폴더에 정리되어 있습니다.

## DB schema

- 데이터베이스 DDL SQL 파일은 [db/](./db) 폴더에 정리되어 있습니다.
- MySQL 은 `PRIMARY_KEY` 와 `FOREIGN_KEY`, `UNIQUE_KEY` 에 대해 인덱스가 자동으로 설정되기에 인덱스에 대한 DDL 은 포함시키지 않았습니다.

## For development

- 의존성 설치하기

```bash
npm install
```

- 개발용 DB 컨테이너 시작하기:

```bash
npm run db:up
```

- 개발용 서버 (with hot-reload) 시작하기:

```bash
npm run start:dev
```

- 개발용 DB 컨테이너 삭제하기:

```bash
npm run db:down
```
