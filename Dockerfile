FROM node:16

ENV NODE_ENV=production
ENV PORT=3005
ENV NEXT_PUBLIC_REACT_APP_API=https://api.daknong.info

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

RUN npm run build

EXPOSE 3005

CMD ["npm", "run", "start"]