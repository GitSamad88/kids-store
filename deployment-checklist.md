# Production Deployment Checklist (T5.6)

## Pre-Deployment Verification
- [x] Environment variables configured (`DATABASE_URL`, `PAYMENT_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`).
- [x] Database migrations verified (`prisma migrate deploy`).
- [x] Production build test (`npm run build`).
- [x] Security review passed (`security-review.md`).
- [x] Performance & SEO audit passed (`performance-audit.md`).

## Hosting & Infrastructure
- **Platform**: Vercel or Node.js Docker container on cloud provider.
- **Database**: Managed PostgreSQL instance (Supabase / Neon / AWS RDS) with automated backups.
- **SSL / Domain**: HTTPS enforced via valid TLS certificates.
- **Monitoring**: Error tracking and performance monitoring configured.
