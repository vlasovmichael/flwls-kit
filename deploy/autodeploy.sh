#!/usr/bin/env bash
# Выкатка проекта с docker compose на Oracle: autodeploy.sh <каталог-репозитория> <контейнер>.
# Вызывает forced command ключа GitHub Actions после зелёного CI; тот же ключ больше ничего не умеет.
# Выкаченный коммит — в $STATE/deployed, не в HEAD: сбой посреди выкатки не выдаёт себя за успех.
set -euo pipefail

repo=${1:?каталог репозитория}
container=${2:?имя контейнера}
STATE="$HOME/.cache/flwls-deploy/$container"
NTFY_ENV="$HOME/.config/flwls-deploy/ntfy.env"
mkdir -p "$STATE"
cd "$repo"

# Ждём, а не выходим: вышедший второй прогон не выкатил бы свой, более новый коммит.
exec 9>"$STATE/lock"
flock -w 900 9

# Шлём через контейнер ntfy, а не через сам проект: сломанный проект о себе не скажет.
alert() {
  echo "FAILED: $1"
  if [[ -r "$NTFY_ENV" ]]; then
    # shellcheck source=/dev/null
    source "$NTFY_ENV"
    docker exec ntfy ntfy publish --quiet ${NTFY_TOKEN:+--token "$NTFY_TOKEN"} --priority high \
      --tags warning --title "$container: deploy failed" \
      "http://localhost:80/$NTFY_TOPIC" "$1 ($(git rev-parse --short "$target"))" || true
  fi
  exit 1
}

git fetch -q origin main
target=$(git rev-parse origin/main)
deployed=$(cat "$STATE/deployed" 2>/dev/null || true)

if [[ "$target" == "$deployed" ]]; then echo "already deployed: $(git log --oneline -1)"; exit 0; fi

echo "deploying $(git log --oneline -1 "$target")"
git merge -q --ff-only origin/main || alert "main on the server has diverged from origin"
docker compose build -q || alert "build failed, the previous container is still running"
docker compose up -d || alert "compose up failed"

for _ in $(seq 1 30); do
  sleep 3
  state=$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null || echo "?")
  if [[ "$state" == "healthy" ]]; then
    echo "$target" >"$STATE/deployed"
    echo "done: healthy"
    exit 0
  fi
done
alert "container not healthy after 90 s, see docker logs $container"
