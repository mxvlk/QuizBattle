FROM node:lts-alpine as build

WORKDIR /app

ARG REACT_APP_AUTH_URL
ARG REACT_APP_CONNECT_URL
ARG REACT_APP_GAME_MANAGEMENT_URL

ENV REACT_APP_AUTH_URL=$REACT_APP_AUTH_URL
ENV REACT_APP_CONNECT_URL=$REACT_APP_CONNECT_URL
ENV REACT_APP_GAME_MANAGEMENT_URL=$REACT_APP_GAME_MANAGEMENT_URL

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build


FROM nginx:alpine-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

