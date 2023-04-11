# Use the official Node.js image as the base image
FROM node:19-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Build the Next.js app
RUN npm run build

# Start the application
CMD ["npm", "start"]