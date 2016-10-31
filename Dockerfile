FROM node:argon

# Create app directory
RUN mkdir -p /Users/bea/Documents/beafork-docker
WORKDIR /Users/bea/Documents/beafork-docker

COPY package.json /Users/bea/Documents/beafork-docker/

COPY . /Users/bea/Documents/beafork-docker/

RUN npm install

EXPOSE 4568
CMD["npm", "start"]
