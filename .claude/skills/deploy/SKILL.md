---
name: deploy
description: Выкатить сайт дизайн-системы (Storybook) на Oracle — ui.flwls.link
---

# Деплой сайта flwls-kit

Прод — контейнер `flwls-kit-docs` на Oracle (`ssh oracle`), код в
`/home/ubuntu/infra/flwls-kit`. Снаружи: Cloudflare Tunnel → `flwls-kit-docs:80`,
вход через Cloudflare Access. Выкатывается только сайт: пакет `@flwls/ui` проекты
берут тегом, его выпуск — по `docs/engineering/release.mdx`.

## Сначала отчёт, потом скрипт

До запуска — словами: что меняется на сайте, какие коммиты уедут
(`git log --oneline origin/main..HEAD` и что уже в `origin/main`, но не на сервере),
чего в выкатке нет. Сайт статический, рестарт ничего не ломает — ответа не ждём.

## Выкатка

```bash
.claude/skills/deploy/deploy.sh
```

Скрипт: `npm run verify`, отказ при незакоммиченном, пуш `main`, на сервере
`git pull --ff-only` и `docker compose up -d --build`, ждёт `healthy`.
Проверить, не трогая: `deploy.sh --check`.

## Грабли

- Клон на сервере общий: из него же forced command ключей CI берёт `deploy/autodeploy.sh`.
  Править файлы на сервере руками нельзя — только через `main`.
- Сборка идёт внутри Docker на ARM: если `npm ci` падает на нативном пакете,
  смотреть, есть ли linux-arm64-musl вариант в `package-lock.json`.
