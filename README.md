<div align="center">
  <img src="public/images/brand/ncreate-logo.webp" alt="Логотип NCreate" width="96">
  <h1>NCreate Site</h1>
  <p>Сайт Minecraft-проекта NCreate: главная страница, аккаунт и форум сообщества.</p>
  <p>
    <img src="https://img.shields.io/badge/React-19-149eca" alt="React 19">
    <img src="https://img.shields.io/badge/TanStack_Start-1.x-ff6942" alt="TanStack Start 1.x">
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6" alt="TypeScript 5">
    <img src="https://img.shields.io/badge/Supabase-Auth_%26_Postgres-3ecf8e" alt="Supabase Auth и Postgres">
  </p>
</div>

## О проекте

Это веб-интерфейс экосистемы NCreate. На главной странице представлены сервер и материалы проекта; отдельные маршруты дают доступ к форуму, регистрации и входу. Сайт использует общие с [NCEA](https://github.com/Yozekkk/ncea-tra) аккаунты и профили, но хранит настройки и форум NCreate в собственных таблицах `ncreate_*`.

Репозиторий содержит приложение TanStack Start, тесты и миграции Supabase. Код лаунчера и файлы Minecraft-сборки живут в отдельных репозиториях.

## Что работает сейчас

| Раздел | Реализация |
| --- | --- |
| Главная | Адаптивная страница, графика NCreate, анимации и блок статистики из `ncreate_site_settings` |
| Аккаунт | Вход и регистрация через Supabase Auth; состояние сессии используется в навигации и форуме |
| Форум | Категории, темы, сообщения, создание тем и ответы для вошедших пользователей |
| Доступ | Чтение и запись данных ограничены политиками Row Level Security и RPC из миграций |

> [!NOTE]
> Часть главной страницы, ссылки «Помощь» и «Донат», а также окно «Начать играть» пока содержат «Скоро будет». Поля `server_ip`, `minecraft_version` и `launcher_url` существуют в схеме, но окно игры сейчас не выводит их значения. Подключение к серверу через сайт пока не реализовано.

## Стек и структура

Приложение написано на React 19 и TypeScript. Маршруты и серверную сборку даёт TanStack Start/Router, интерфейс собирается Vite и Tailwind CSS 4. Для запросов используются Supabase JS и TanStack Query; формы используют React Hook Form и Zod.

```text
src/routes/             Главная, Auth и маршруты форума
src/lib.tsx             Supabase client, запросы и состояние аккаунта
src/ui.tsx              Общие элементы сайта и формы форума
src/styles.css          Стили интерфейса
supabase/migrations/    Таблицы, RLS-политики и RPC NCreate
tests/                 Контрактные и маршрутные тесты
scripts/               Build info и браузерная регрессия
public/images/         Логотип и изображения сайта
```

## Локальная разработка

В проекте зафиксирован pnpm 11.19.0. Установите зависимости и запустите dev server:

```bash
git clone https://github.com/Yozekkk/ncreate-site.git
cd ncreate-site
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

В [.env.example](.env.example) перечислены `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY`. Укажите publishable key своего Supabase-проекта для изолированной разработки. Клиентский код содержит значения по умолчанию для текущей NCEA-среды; запуск без локальных переменных может обращаться к ней. Значения `VITE_*` доступны браузеру, поэтому сервисный ключ, пароли и другие секреты в них помещать нельзя.

Для работы Auth и форума нужна совместимая схема Supabase: общие `profiles` и `user_roles` из NCEA, затем [миграции NCreate](supabase/migrations). Миграции добавляют таблицы NCreate и не заменяют основную схему NCEA. Доступ к данным контролируют RLS-политики и функции `create_ncreate_forum_topic` / `create_ncreate_forum_reply`.

## Проверка и сборка

`check` запускает тесты, проверку типов, ESLint и production build:

```bash
pnpm check
```

Те же шаги доступны по отдельности: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`. После сборки сервер можно запустить командой `pnpm start`; она использует `.output/server/index.mjs`. Тесты находятся в [tests/](tests), а браузерный сценарий для ручной регрессии — в [scripts/browser-regression.mjs](scripts/browser-regression.mjs).

## Развёртывание

[vercel.json](vercel.json) задаёт установку через pnpm и команду `pnpm build` для Vercel. Производственные переменные окружения должны соответствовать целевому Supabase-проекту. Отдельной GitHub Actions-публикации в этом репозитории нет; конфигурация Vercel сама по себе не подтверждает состояние конкретного deployment.

## Связанные репозитории

- [ncea-tra](https://github.com/Yozekkk/ncea-tra): общие Auth, профили и административное рабочее пространство NCreate
- [ncreate-launcher](https://github.com/Yozekkk/ncreate-launcher): десктопная установка и запуск Minecraft
- [ncreate-pack](https://github.com/Yozekkk/ncreate-pack): опубликованный manifest официальной серверной сборки
- [ncreate-manifests](https://github.com/Yozekkk/ncreate-manifests): отдельный pipeline ещё не опубликованных редакций Minimal, Standard и Ultra
