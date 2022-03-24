FROM node:16.0.0 as build-stage

# default branch name is master if no pass branch name
ARG BRANCH_NAME_ARG=dev
ENV BRANCH_NAME_ENV=$BRANCH_NAME_ARG

WORKDIR /app
COPY package*.json ./
RUN yarn --network-timeout 1000000
COPY . .9
RUN yarn run build

EXPOSE 80

CMD ["yarn", "run", "start:docker"]