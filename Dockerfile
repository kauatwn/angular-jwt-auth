FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine AS final
COPY --from=build /app/dist/angular-jwt-auth/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]