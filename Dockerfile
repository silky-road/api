FROM node:16

# For gyp Err and it needs a Python
# RUN apk add g++ make python

WORKDIR /app
RUN npm i -g yarn
RUN npm i -g @nestjs/cli
COPY package.json .
RUN yarn
COPY . .

RUN yarn add prisma -dev
RUN yarn prisma generate


CMD ["yarn", "start:dev"]