FROM node:16

# For gyp Err and it needs a Python
# RUN apk add g++ make python

WORKDIR /app
RUN npm i -g @nestjs/cli
COPY package.json .
RUN npm install
COPY . .

RUN npm install prisma -d
RUN npx prisma generate
RUN chown -R 1000:1000 "/root/.npm"


CMD ["npm", "start"]