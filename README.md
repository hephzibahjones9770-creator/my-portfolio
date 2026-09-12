# Portfolio CMS

Next.js portfolio with protected admin, Prisma/Supabase data, dynamic resume, analytics, PWA support, and validated media uploads.

## Local development

Copy `.env.example` to `.env.local`, fill in real values, and never commit `.env.local`.

```bash
npm install
dotenv -e .env.local -- npx prisma@5.22.0 generate
npm run db:migrate-admin
npm run dev
```

Routes:

- `/` public portfolio
- `/resume` public resume
- `/admin` or `/admin/login` admin login
- `/api/health` database health check

## Production deployment

1. Push the repository to a private Git provider.
2. Import it into a Next.js host such as Vercel.
3. Set the build command to `npm run build` and install command to `npm ci`.
4. Configure `NEXT_PUBLIC_API_URL`, `JWT_SECRET_KEY`, `DATABASE_URL`, and `DIRECT_URL` in the host. Use a new random JWT secret of at least 32 characters.
5. Apply committed migrations from a controlled release step:

```bash
npm run db:deploy
```

Use the Supabase pooler URL for `DATABASE_URL` and direct session URL for `DIRECT_URL`. Do not run `migrate dev` against production.

After deploy, verify:

```text
https://hephzibahjones.online/
https://hephzibahjones.online/admin
https://hephzibahjones.online/api/health
https://hephzibahjones.online/manifest.webmanifest
```

The health endpoint should return HTTP 200 with `status: ok` and `database: connected`.

## File storage warning

The current development upload route writes to `public/uploads`. Serverless filesystems are ephemeral, so production uploads must be moved to Supabase Storage, Vercel Blob, or S3 before relying on uploads in production. Preserve the existing authentication, MIME allowlist, 10 MB limit, generated names, and private-by-default behavior when replacing the storage adapter.

## Domain and HTTPS

Add `hephzibahjones.online` in the hosting provider, update DNS at the registrar, wait for TLS, and set `NEXT_PUBLIC_API_URL` to `https://hephzibahjones.online`. Then verify the public site, `/admin`, health endpoint, and PWA manifest.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test:security
npm run build
```

## Release checklist

- [ ] Production secrets are configured in the host, not Git
- [ ] Supabase is running and migrations are applied
- [ ] Admin account exists and login works
- [ ] `/api/health` returns 200
- [ ] Published content is intentional
- [ ] Object storage replaces local uploads
- [ ] Backup endpoint is authenticated and tested
- [ ] Desktop and mobile smoke checks pass
- [ ] Custom domain and HTTPS are verified
- [ ] Database backup and rollback plan are ready

Multi-language content, complete CRUD forms for every model, and Playwright/Cypress browser automation remain follow-up work.
