# ------ lama ---------
#FROM node:14-alpine

#WORKDIR /usr/src/app

#COPY package*.json ./

#RUN yarn install
#RUN apk add curl

#COPY . .

#EXPOSE 3001

#CMD [ "yarn", "start" ]





FROM node:16.16-alpine

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ../pens-vlab-backend-css ./

RUN yarn install
RUN yarn prisma:generate
RUN yarn prisma:migrate
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 3001

CMD [ "yarn", "start" ]
