# Electric Car Trader Australia – MVP v2.5 (AI + CI)

Next.js + Tailwind + Prisma/PostgreSQL + NextAuth + S3 + SES + Stripe + **AI Listing Assistant** + **Docker** + **GitHub Actions CI**.

## Local
```bash
npm install
cp .env.example .env   # fill keys
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Docker
```bash
docker compose up -d   # Postgres
docker build -t electriccartrader .
docker run --env-file .env -p 3000:3000 electriccartrader
```

## CI/CD (GitHub Actions → Amplify)
- Workflow file: `.github/workflows/ci.yml`
- On push to `main`: typecheck + build; then triggers an **Amplify** build via AWS CLI.
- Set repository **Secrets**:
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (e.g. `ap-southeast-2`)
  - `AMPLIFY_APP_ID` (from Amplify Console)
- Optional app env secrets (used at runtime): `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_LISTING`, `STRIPE_WEBHOOK_SECRET`, `OPENAI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

> Note: Amplify usually deploys automatically when connected to GitHub. The action here additionally **forces a build** using `aws amplify start-job`.
