# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js (version >= 20.11.0 LTS) - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Download and switch to the target branch

```
git clone https://github.com/anatolhancharou/nodejs2024Q1-service.git
```

```
git checkout feature/containerization-database-orm
```

## Install NPM modules

```
npm install
```

## Create `.env` file based on provided `.env.example` file

Before starting the app it is preferably to clean / purge data (volumes, etc.) via Docker Desktop "Troubleshoot" option

## Run the application using Docker compose

```
npm run docker:compose:up
```

If you change a service's Dockerfile or the contents of its build directory OR in case of any incompatibility issues, run the following command to rebuild it.

```
npm run docker:compose:build
```

To stop and remove containers, networks run

```
npm run docker:compose:down
```

After starting the app on port you can open
in your browser OpenAPI documentation by typing http://localhost:4000/docs/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all tests with authorization (not implemented yet)

```
npm run test:auth
```

To run only specific test suite with authorization (not implemented yet)

```
npm run test:auth -- <path to suite>
```

## Scanning for vulnerabilities

```
npm run docker:scan
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
