FROM node:10 as builder
RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY client/package.json /app/package.json
RUN npm install
COPY client /app
RUN npm run build

FROM nginx:1.15
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /code/api/public
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
