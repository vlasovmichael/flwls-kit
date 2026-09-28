# Автодеплой на Oracle

Общий для проектов с `docker compose` на Oracle: CI проекта после зелёных
проверок заходит по SSH ключом, который умеет только одно — выкатить `main`.

## Подключить проект

1. В CI проекта — задача после проверок:

   ```yaml
   deploy:
     needs: verify
     if: github.event_name == 'push' && github.ref == 'refs/heads/main'
     uses: vlasovmichael/flwls-kit/.github/workflows/oracle-deploy.yml@main
     secrets:
       DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
       DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
       DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
   ```

2. Отдельный ключ на проект: `ssh-keygen -t ed25519 -N '' -f deploy-<проект>`.
   Закрытый — в секрет `DEPLOY_SSH_KEY` репозитория, там же `DEPLOY_HOST` и
   `DEPLOY_KNOWN_HOSTS` (`ssh-keyscan -p 2234 <host>`).
3. Открытый — в `~/.ssh/authorized_keys` на сервере одной строкой:

   ```
   command="cd /home/ubuntu/infra/flwls-kit && git pull -q --ff-only origin main && exec deploy/autodeploy.sh /home/ubuntu/<проект> <контейнер>",restrict ssh-ed25519 AAAA… github-actions-<проект>
   ```

У контейнера должен быть `healthcheck`: скрипт ждёт `healthy` 90 секунд.
Сбой уходит в ntfy, если на сервере есть `~/.config/flwls-deploy/ntfy.env`
с `NTFY_TOPIC` и `NTFY_TOKEN`.
