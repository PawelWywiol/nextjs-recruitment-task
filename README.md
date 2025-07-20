## Getting Started

### Run Development Environment

To run the development environment, you need to set up your environment variables first. Copy the example environment file:

```bash
# copy the example environment file
# and update it with your local settings
cp .env.example .env.local
```

```bash
# run db container
docker compose up -d
```

```bash
# install dependencies
npm install
# generate types
npm run generate-types
```

```bash
# run the Next.js app in development mode
npm run dev
```

### Run Production Environment

To run the production environment, you also need to set up your environment variables. Copy the example environment file:

```bash
# copy the example environment file
# and update it with your production settings
cp .env.example .env
```

```bash
# make sure database is running,
# you can use the same command as in development
# or run the db container with production settings
docker compose up -d
```

```bash
# install dependencies and generate types
npm install
npm run generate-types

# build the Next.js app
npm run build

# run the Next.js app in production mode
npm run start
```

## Build Docker Image and Run Container

To build the Docker image and run the container, you can use the following commands. Make sure to set the `DATABASE_URL` environment variable in your `.env` file or pass it directly when building the image.

```bash
# export environment variables from .env file
export $(grep -v '^#' .env | xargs)
# or set DATABASE_URL directly
# export DATABASE_URL=postgresql://...
```

```bash
# build the Docker image
docker build -t nextjs-recruitment-task . --build-arg DATABASE_URL=$DATABASE_URL
```

```bash
# unset the DATABASE_URL variable
unset DATABASE_URL
```

```bash
# run the Docker container with the environment variables
docker run --env-file .env -p 3000:3000 nextjs-recruitment-task
```

## Docker Compose for Production

```bash
# make sure database is running, you can use the same command as in development
docker compose up -d
```

```bash
# export environment variables from .env file
export $(grep -v '^#' .env | xargs)
# or set DATABASE_URL directly
# export DATABASE_URL=postgresql://...
```

```bash
# build the Docker image with production settings
docker compose -f docker-compose.production.yml build --no-cache --build-arg DATABASE_URL=$DATABASE_URL
```

```bash
# unset the DATABASE_URL variable
unset DATABASE_URL
```

```bash
# run the Docker container with production settings
docker compose -f docker-compose.production.yml up -d
```

## Testing

To run the tests, you can use the following command:

```bash
npm run test
```

## End-to-End Testing

To run the end-to-end tests, you can use the following command:

```bash
npm run test:e2e
```

## Scripts

```bash
{
  "scripts": {
    "dev": "next dev --turbopack", # Run app in development mode
    "build": "next build", # Build app for production
    "start": "next start", # Start app in production mode
    "lint": "biome lint", # Lint the codebase using Biome
    "format": "biome format --write .", # Format the codebase using Biome
    "check": "biome check --write .", # Check the codebase using Biome
    "generate-types": "prisma generate", # Generate Prisma types
    "test": "vitest", # Run unit tests using Vitest
    "test:cov": "vitest run --coverage", # Run unit tests with coverage
    "test:e2e": "playwright test --config=playwright.config.ts", # Run end-to-end tests using Playwright
    "test:e2e:raport": "playwright show-report", # Show the end-to-end test report
    "type-check": "tsc --noEmit", # Type check the codebase using TypeScript
    "prepare": "husky" # Prepare Husky hooks
  },
}
```

## Task

Create a NextJS application which allows you to manage users' addresses. The database schema with sample records is provided for you, you can set it up by running:

```bash
docker compose up
```

## UI Requirements

1. The UI should only include what's required in task's description. There is no need to build authentication, menus or any features besides what's required.
2. The UI should consist of:

- A paginated users' list. Add a mocked button to **Create** a new user above the list and in each record, a context menu with mocked **Edit** and **Delete** buttons.
- A paginated users' addresses list. The list should be visible after clicking a user record in the users' list.
- In the addresses list, include a context menu where you can **Edit** and **Delete** an address record.
- Add the ability to **Create** a new user address.
- **Create** and **Edit** forms should be implemented in modals.
- When inputting address fields, display a preview of the full address in the realtime in the following format:

```
<street> <building_number>
<post_code> <city>
<country_code>
```

3. You may use any UI library: MUI, AntD, etc.
4. Handle data validation errors coming from the server.

## Server Requirements

1. Use the database schema provided. Do not modify it.
2. Implement ["Server Actions"](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) which the frontend should use to interact with the database.
3. You may use any ORM or Query Builder.
4. Introduce simple data validation. Nothing fancy, you can use constraints from the database schema. Country codes use ISO3166-1 alpha-3 standard.

## General Requirements

1. Expect the application to eventually include many similar CRUD components (i.e. "users_tasks", "users_permissions", etc.), make your code modular, extensible and generic so that similar modules can be developed with less overhead.
2. Keep the code clean, scalable, follow known conding conventions, paradigms, patterns, etc.
3. Use TypeScript.
4. You do not have to deploy the application, but prepare the codebase for deployment to an environment of your choice.
