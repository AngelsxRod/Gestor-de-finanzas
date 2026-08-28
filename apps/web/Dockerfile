FROM node:24-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /workspace

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/models/package.json packages/models/package.json
COPY packages/tooling/package.json packages/tooling/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile

FROM dependencies AS build

ARG API_INTERNAL_URL=http://api:3211
ENV API_INTERNAL_URL=$API_INTERNAL_URL
COPY . .
RUN pnpm --filter @gestor-finanzas/contracts build \
  && pnpm --filter @gestor-finanzas/ui build \
  && pnpm --filter @gestor-finanzas/web build

FROM node:24-alpine AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3210
WORKDIR /app

COPY --from=build /workspace/apps/web/.next/standalone ./
COPY --from=build /workspace/apps/web/public ./apps/web/public
COPY --from=build /workspace/apps/web/.next/static ./apps/web/.next/static

USER node
CMD ["node", "apps/web/server.js"]
