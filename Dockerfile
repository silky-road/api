FROM node:15

# For gyp Err and it needs a Python
# RUN apk add g++ make python

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm i -g @nestjs/cli
RUN npm install prisma -d
RUN npm prisma generate


CMD ["npm", "start:dev"]