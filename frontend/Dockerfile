# stage 1
FROM node:20-alpine as builder

WORKDIR /frontendapp
COPY package*.json ./
RUN npm install
COPY . .
# A head-of-time compilation using local Angular CLI
RUN npx ng build --configuration production

# stage 2
FROM nginx:1.17.1-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontendapp/dist/front-end-app/browser /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]

