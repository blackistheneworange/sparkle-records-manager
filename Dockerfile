#latest nodejs version to use
FROM node:16

#Create app directory
WORKDIR /usr/src/app/sparkle-records-system

# Install app dependencies
# where available (npm@5+)
COPY package.json ./

RUN npm install --omit=dev
# If you are building your code for production
# RUN npm ci --only=production

RUN apt-get update

# Bundle app source
COPY . .

# Perform client build
RUN cd client && npm install && npm run build && rm -r node_modules && cd ../

#Expose server port
EXPOSE 8000

#Start server
CMD [ "npm", "start" ]