FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

RUN npm run build

# saves 12 mb
RUN wget -O - https://gobinaries.com/tj/node-prune | sh
RUN node-prune /app/node_modules


FROM node:lts-alpine as runner

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist


CMD npm run prod
