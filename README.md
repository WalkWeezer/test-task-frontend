# Test Task — Frontend (React + TypeScript)

SPA по тестовому заданию: mock-авторизация, таблица курсов валют с графиком к USD и форма создания карточки.

- Деплой: https://test-task-frontend-liart.vercel.app
- Макет: [Figma Test Task](https://www.figma.com/design/p3bs7nOd0noohqkGTjOvTm/Test-Task)

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Mock-логин

- Email: `user@example.com`
- Password: `password`

Без авторизации доступна только `/login`. Сессия хранится в `localStorage`.

## API

- Актуальные курсы: [Open Exchange Rate API](https://www.exchangerate-api.com/docs/free) (`https://open.er-api.com/v6/latest/USD`) — без ключа, есть BGN и остальные валюты из макета.
- История графика: [Frankfurter](https://frankfurter.dev/) (`https://api.frankfurter.dev/v1`).
- Флаги: [Flagcdn](https://flagcdn.com/).

Колонки **Surrender / Buy** в макете — bid/ask. Frankfurter отдаёт только mid-курс, поэтому:

- `Course` — mid из API;
- `Surrender` / `Buy` — mid ± 1.2%;
- `Change` — разница с предыдущим доступным днём;
- график — динамика выбранной валюты к USD за 30 дней.

## Стек

Vite, React 19, TypeScript, React Router, react-hook-form, Recharts, CSS Modules.
