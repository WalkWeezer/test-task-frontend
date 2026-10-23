# Тестовое (React + TS)

SPA по макету: логин, таблица курсов, форма карточки.

- деплой: https://test-task-frontend-liart.vercel.app
- макет: [Figma](https://www.figma.com/design/p3bs7nOd0noohqkGTjOvTm/Test-Task)

## запуск

```bash
npm i
npm run dev
```

Сборка: `npm run build`

## логин

`admin` / `admin`

Бэка нет, сессия в localStorage. Без него на остальные страницы не пускает.

## курсы

Хотел обойтись одним frankfurter, но он BGN не отдаёт (404). Поэтому:

- таблица — `https://open.er-api.com/v6/latest/USD` (там лев есть)
- график — `https://api.frankfurter.dev/v1`
- для BGN на графике беру EUR и умножаю на текущий peg BGN/EUR

В макете есть Surrender/Buy, а в апи только mid. Накинул спред ±1.2%, иначе колонки пришлось бы дублировать одно и то же число.

Флаги — twemoji svg. На винде эмодзи-флаги рисуются как «AU»/«BG», бесит.

## стек

Vite, React, TS, react-router, react-hook-form, recharts. Стили — css modules.
