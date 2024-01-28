FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Bundle app siyrce
RUN npm run build

# Expose the port on which your Nest.js app runs
EXPOSE 3002

# Start the app
CMD ["npm", "run", "start:dev"]