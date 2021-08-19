FROM node:15

# For gyp Err and it needs a Python
# RUN apk add g++ make python

WORKDIR /app
COPY package.json .
RUN yarn
RUN yarn add @nestjs/cli
COPY . .

RUN yarn prisma generate


CMD ["yarn", "start"]
