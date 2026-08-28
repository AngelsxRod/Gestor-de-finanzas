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

COPY . .
RUN pnpm --filter @gestor-finanzas/models build \
  && pnpm --filter @gestor-finanzas/contracts build \
  && pnpm --filter @gestor-finanzas/api build

FROM build AS migrations

ENV NODE_ENV=production
CMD ["pnpm", "db:migrate"]

FROM node:24-alpine AS runner

ENV NODE_ENV=production
WORKDIR /workspace

COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /workspace/apps/api/dist ./apps/api/dist
COPY --from=build /workspace/apps/api/package.json ./apps/api/package.json
COPY --from=build /workspace/packages/contracts ./packages/contracts
COPY --from=build /workspace/packages/models ./packages/models

USER node
CMD ["node", "apps/api/dist/main.js"]
