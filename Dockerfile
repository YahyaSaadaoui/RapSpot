# Calling the official Node.js image as the base image for Rapspot 
FROM node:18

# Setting up the working directory inside the container of Rapspot
WORKDIR /app

# Copy package.json and package-lock.json files from local code of Rapspot
COPY package*.json ./

# Installing project dependencies
RUN npm install

# Copy the entire project directory
COPY . .

# Copy the .env file into the working directory
COPY .env .env

# Build the Next.js app
RUN npm run build

# Set environment variables defined in the .env file
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV NEXT_PRODUCTION_URL=$NEXT_PRODUCTION_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_VERCEL_URL=$NEXT_PUBLIC_VERCEL_URL

# Expose the port that Next.js will run on , i set it up similar to the one i use locally
EXPOSE 3000

# Start the Next.js app (i dont us npm run start there is no definition of it in the package.json)
CMD ["npm", "run","dev"]