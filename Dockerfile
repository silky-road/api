FROM node:15

# For gyp Err and it needs a Python
# RUN apk add g++ make python

WORKDIR /app

COPY package.json .
RUN yarn
COPY . .
RUN yarn add prisma -d
RUN yarn prisma generat


CMD ["yarn", "start:dev"]