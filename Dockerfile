# Use the official Node.js image as the base stage
FROM node:19-alpine as base

RUN apk add --no-cache openssl

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG NEXTAUTH_SECRET=$(openssl rand -base64 32)
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the rest of the application code
COPY . .

RUN sed -ie 's/postgresql/sqlite/g' prisma/schema.prisma \
    && sed -ie 's/mysql/sqlite/g' prisma/schema.prisma \
   && sed -ie 's/@db.Text//' prisma/schema.prisma


# Add Prisma and generate Prisma client
RUN npx prisma generate  \
    && npx prisma migrate dev --name init  \
    && npx prisma db push

# Expose the port the app will run on
EXPOSE 3000

# Preview stage
FROM base AS development

ENV NODE_ENV=development

# Install dependencies
RUN npm i

# Start the application
CMD ["npm", "run", "dev"]