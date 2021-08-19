FROM node:16

# For gyp Err and it needs a Python
# RUN apk add g++ make python

WORKDIR /app

COPY package.json .
RUN npm install -g @nestjs/cli

COPY . .
CMD ["npm","run", "start:dev"]
