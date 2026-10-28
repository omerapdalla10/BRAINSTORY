## Brain Story Website

This is a Next.js website for Brain Story Organization with a MongoDB-powered blog system.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install and start a local MongoDB (https://www.mongodb.com/try/download/community), then create `.env.local` (see `.env.example`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=brainstory
AUTH_SECRET=a-long-random-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

3. Create indexes and the first super admin user:

```bash
npm run seed
```

4. Start the dev server:

```bash
npm run dev
```

## Admin Dashboard

- Open `/auth/login` and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` account.
- Open `/app/dashboard` to manage blogs, categories and profiles.
- Published posts will appear automatically on `/reports`.

## Notes

- Data lives in MongoDB collections `profiles`, `categories` and `blogs`.
- Sessions are signed JWT cookies; `AUTH_SECRET` must stay server-side only.
- Uploaded images are stored in `public/uploads`.
