#!/usr/bin/env bash
# Выкатка сайта дизайн-системы на Oracle. --check только показывает состояние.
set -euo pipefail

REMOTE_DIR=/home/ubuntu/infra/flwls-kit
CONTAINER=flwls-kit-docs
cd "$(git rev-parse --show-toplevel)"

check() {
  ssh oracle "cd $REMOTE_DIR && git log --oneline -1 && docker inspect -f '{{.State.Health.Status}} since {{.State.StartedAt}}' $CONTAINER"
  curl -s -o /dev/null -w "ui.flwls.link: %{http_code}\n" https://ui.flwls.link/ || true
}

if [[ "${1:-}" == "--check" ]]; then check; exit 0; fi

# Прод тянет из git: незакоммиченное до него не доедет, а выкатка сделает вид, что доехало.
if [[ -n "$(git status --porcelain)" ]]; then echo "есть незакоммиченное — выкатки нет"; exit 1; fi

npm run verify
git push -q origin main

ssh oracle "set -e
  cd $REMOTE_DIR
  git pull -q --ff-only origin main
  docker compose build -q
  docker compose up -d
  for _ in \$(seq 1 30); do
    sleep 3
    [ \"\$(docker inspect -f '{{.State.Health.Status}}' $CONTAINER)\" = healthy ] && exit 0
  done
  echo 'контейнер не стал healthy за 90 с'; docker logs --tail 30 $CONTAINER; exit 1"

check
