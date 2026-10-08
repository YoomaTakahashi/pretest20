# FROM node:20
# WORKDIR /app
# COPY packege*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3001
# CMD [ "npm","-y","nodemon","-L","index.js" ]



FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm","run","dev","--","--","host","0.0.0.0" ]