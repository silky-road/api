FROM node:15

# For gyp Err and it needs a Python
# RUN apk add g++ make python

WORKDIR /app

COPY package.json .
RUN yarn
COPY . .
RUN npm i -g @nestjs/cli
RUN yarn add prisma -d
RUN yarn prisma generate


CMD ["yarn", "start:dev"]