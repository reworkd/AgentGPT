# Use the official Node.js image as the base image
FROM node:19-alpine

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

# Set the working directory
WORKDIR /next

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the wait-for-db.sh script
COPY wait-for-db.sh /usr/local/bin/wait-for-db.sh
RUN chmod +x /usr/local/bin/wait-for-db.sh

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

ENTRYPOINT ["sh", "entrypoint.sh"]

# Start the application
CMD ["npm", "run", "dev"]
