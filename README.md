# Tictactrip Assignment by Aymen Bouhaha

## Description

As part of the Tictactrip hiring process, I developed a Node.js REST API application that provides an automated text justification service. This application processes user-submitted text, returning it in a fully justified format, optimized for readability. The API integrates user authentication to secure access, allowing only authorized users to submit text for processing. Additionally, it includes a rate-limiting feature to manage usage, capping the amount of text each user can justify per day. This ensures efficient resource allocation and maintains service quality for all users.

## Folders & Files Description


- `.github/workflows` : it contains the pipeline for deploying infrastructure and deploying application
- 
- `infrastructure` : it contains terraform files for provisioning the infrastructure
-
- `application/documentation`documentation : it contains the swagger file documentation of the api
- `application/src/config` : it contains the database configuration file
- `application/src/controller` : it contains the controllers of the application : the entry points of each api
- `application/src/entity` : it contains the schema of database tables (User table)
- `application/src/interceptors` : it contains interceptors for requests : an interceptor for rate limiting, 2 interceptors for checking DTOs , an interceptor for checking authentication
- `application/src/models` : it contains the schema used alongside the app (Exception classes, Dtos(Data transfer objects))
- `application/src/services` : it contains the service layer of the application, the classes that handles the business logic inside the app
- `application/src/types` : it contains an extension file for the Request object of Express
- `application/src/utils` : it contains helper functions used alongside the application

## Run locally

#### Step 1 : ENV file

In the root folder:

- create an `.env` file
- copy the contents of `.env.example` in `.env`

(Change the content of env variables like you want)

### Running the application in a docker container

Before running the project please ensure that the port `3000` is not used by any other process,if the port is not free,
either kill the process using it or change the port mapping in `docker-compose.yml` file to `"WHATEVER_PORT":"3000"`

#### Step 2 : Run the project

```bash
 docker-compose up -d --build
```

