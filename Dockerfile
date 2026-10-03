# Сайт дизайн-системы: Storybook собирается в статику, nginx её отдаёт. Кит как пакет сюда не входит.
FROM node:22-alpine AS build
WORKDIR /kit
COPY package.json package-lock.json ./
COPY packages/ui/package.json packages/ui/
# Скрипты пакетов не нужны: браузеры для тестов и git-хуки сборке сайта ни к чему.
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . .
RUN npx storybook build --quiet -o /site

FROM nginx:1.27-alpine
COPY deploy/docs-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site /usr/share/nginx/html
HEALTHCHECK --interval=60s --timeout=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
