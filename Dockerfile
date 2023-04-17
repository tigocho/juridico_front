# # develop stage
# FROM node:14.17-alpine as develop-stage

# # install simple http server for serving static content
# RUN npm cache clean --force
# RUN npm config set strict-ssl false
# RUN npm install -g http-server
# RUN apk update && apk add nano
# # make the 'app' folder the current working directory
# WORKDIR /app

# # copy both 'package.json' and 'package-lock.json' (if available)
# COPY package*.json ./

# # install project dependencies
# RUN npm install

# # copy project files and folders to the current working directory (i.e. 'app' folder)
# COPY . .

# # build app for production with minifications
# RUN npm run build

# EXPOSE 8082
# CMD [ "http-server", "app/app" ]
# # CMD ["npm", "run", "serve"]

# Queda como pendiente para ensayar más adelante
# # develop stage
# FROM node:14.17-alpine as develop-stage
# WORKDIR /usr/src/app
# COPY . ./
# RUN npm cache clean --force
# RUN npm config set strict-ssl false
# RUN npm install
# RUN npm run build
# FROM nginx:alpine
# COPY --from=develop-stage /usr/src/app /var/www
# COPY nginx/nginx.conf /etc/nginx/nginx.conf
# EXPOSE 8080
# ENTRYPOINT ["nginx","-g","daemon off;"]



# develop stage
FROM node:14.17-alpine as develop-stage

# install simple http server for serving static content
RUN npm cache clean --force
RUN npm config set strict-ssl false
# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minifications
RUN npm run build
FROM nginx:alpine
RUN apk update && apk add nano
COPY --from=develop-stage /app /var/www
COPY nginx/nginx.conf /etc/nginx/nginx.conf
# COPY .htaccess /etc/nginx/nginx.conf
EXPOSE 8080
ENTRYPOINT ["nginx","-g","daemon off;"]
