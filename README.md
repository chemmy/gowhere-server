# GoWhere Server

A simple application that returns traffic images and weather forecast based on datetime provided. Also available is reports for the searches made.

## Local Setup

1. Clone repository or download zip
2. Add .env to root folder, copy from envsample file and update if necessary
3. Run `npm i` to install dependencies
4. **`CACHING`** - Install redis then start (use links if need more details)

   1. Mac: https://redis.io/docs/install/install-redis/install-redis-on-mac-os

      ```
      brew install redis

      brew services start redis
      ```

   2. Windows: https://redis.io/docs/install/install-redis/install-redis-on-windows/

5. **`DATABASE`**
   1. Install pgAdmin https://www.pgadmin.org/download/
   2. Create localhost server
   3. Add database named `gowhere`
   4. Note: synchronization is currently turned on so it will automatically create the columns for your database.
6. Run server `npm run start:dev`

## Application

1. This application will provide list of locations with their traffic images and weather forecast based on date and time
2. In addition, reports are also available based on the searches made.
3. Api routes are defined on all controllers

## Assumptions / Critical Decisions

1. Use of third-party service (OpenCage) for reverse-geocoding instead of the provided second api. OpenCage provided more concise location name in comparison to the second api which shares location names.
2. Caching of OpenCage results per coordinates, assuming the API will provide similar response. Currently it is left to its default TTL which is indefinite; can be changed based on needs.
3. Not caching traffic and weather fetches as they are based on date&time which can be very different per user. They should also be up to date as much as possible.
4. Set maximum of 100 as a distance considered as near to a location in finding nearest location

## Architecture Overview

### NestJS

NestJS is a framework for building scalable Node.js server-side applications, making use of HTTP server framework under the hood. The architecture is heavily inspired by Angular.

- Modules - encapsulates related features and functionalities.
- Controllers - responsible for handling incoming HTTP requests and defining API routes.
- Services - contains the business logic of the application
- Providers - services, repositories, factories, helpers can be treated as providers which can be injected as a dependency

### Database

This project uses PostgreSQL as the database. Configuration should be available in .env file for successful connection.

## Improvements

1. Add user field for reports to link each search to a user
2. Cloudwatch
3. Sentry
