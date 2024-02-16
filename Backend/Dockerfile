# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 8000
EXPOSE 8000

# Run npm run elastic when the container launches
CMD ["npm", "run", "elastic"]

