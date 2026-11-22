# Plan: Full Code Review and Bug-Fix Loop for the Kids Store

## Goal
Execute a rigorous bug-fix loop for the kids store e-commerce application, following the specified instructions, safety protocols, and testing gate criteria (up to 5 rounds).

## Step 1: Setup & Baseline
- Check `git status` (done, uncommitted changes detected).
- Stop `npm run dev` if running, create branch `review/bugfix-loop`.
- Establish and record baseline metrics: `npx prisma validate`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, Playwright tests, `npm audit --omit=dev`.

## Step 2: The Loop (Max 5 Rounds)
- **Step A: REVIEW** (9 distinct areas: Auth/sessions, Authorization, Input validation/injection, Data & Prisma, Storefront correctness, Cart/checkout/orders, Next 16 & React, i18n/RTL/accessibility, Config & quality). Deduplicate and verify findings.
- **Step B: FIX** (Fix confirmed findings highest severity first, add/update regression tests, minimal changes, Prisma migrations if needed).
- **Step C: VERIFY** (Re-run full gate: prisma validate, lint, typecheck, build, test, Playwright, audit).
- **Step D: COMMIT AND LOG** (One commit per round, append short summary to `IMPLEMENTATION_LOG.md`).

## Step 3: Stopping Rule & Final Report
- Check stopping conditions (full gate green except pre-existing baseline failures, two consecutive rounds with 0 new confirmed findings, or max 5 rounds reached).
- Provide comprehensive final report in chat.
