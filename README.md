## General Information

This application was developed as part of a recruitment task. It is a modular and extensible CRUD system built with Next.js (App Router), Prisma, PostgreSQL, and modern development tooling.

### Error Handling

In this project, `try/catch` blocks are intentionally omitted in most asynchronous functions and server actions. Instead, a centralized `errorHandler` utility is used to ensure:

- **Cleaner and more readable code** – asynchronous logic is easier to follow without repetitive error-handling logic.
- **Consistency** – all errors are treated and formatted in a uniform way.
- **Extendability** – it is easier to integrate external tools such as **Sentry**, **telemetry**, or **custom logging** solutions from a single place.
- **Scalability** – centralized error handling simplifies debugging and maintenance as the application grows.

This approach is especially useful in applications with many similar asynchronous operations (e.g., CRUD operations), as it avoids boilerplate and enables cross-cutting concerns (like error logging) to be managed in one location.

The `handleErrors` function wraps an async call and returns a result object with either:

- `{ isSuccess: true, data }` on success
- or `{ isSuccess: false, isUnknownError, error }` on failure.

The result object is then processed at the component level to handle error display or feedback, without the need to `try/catch` every function.

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

To build the Docker image and run the container, you can use the following commands. Make sure to set the `DATABASE_URL` environment variable in your `.env` file.

```bash
# make sure database is running,
# you can use the same command as in development
# or run the db container with production settings
docker compose up -d
```

```bash
# build the Docker image with production settings
docker compose --env-file .env -f compose.production.yml build --no-cache
```

```bash
# run the Docker container with production settings
docker compose --env-file .env -f compose.production.yml up -d
```

## Deployment

To deploy the application, you can use any cloud provider that supports Docker containers. The steps generally include:

1. Build the Docker image as described above.
2. Push the Docker image to a container registry (e.g., Docker Hub, AWS ECR, Google Container Registry).
3. Create a new container instance in your cloud provider using the pushed Docker image.
4. Set the environment variables in your cloud provider's container settings, ensuring that the `DATABASE_URL` is correctly configured.
5. Expose the necessary ports (e.g., port 3000 for the Next.js app).
6. Optionally, set up a reverse proxy (e.g., Nginx) to handle HTTPS and route traffic to your application.

## Example Deployment with Kubernetes

Push the Docker image to a container registry:

```bash
docker push <your-dockerhub-username>/<docker-image-name>:<docker-image-tag>
```

Create a Kubernetes deployment YAML file (e.g., `deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-recruitment-task
  labels:
    app: nextjs-recruitment-task
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nextjs-recruitment-task
  template:
    metadata:
      labels:
        app: nextjs-recruitment-task
    spec:
      containers:
        - name: nextjs-recruitment-task
          image: <your-dockerhub-username>/<docker-image-name>:<docker-image-tag>
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
          env:
            - name: PORT
              value: "3000"
```

Create a Kubernetes service YAML file (e.g., `service.yaml`):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nextjs-recruitment-task
spec:
  selector:
    app: nextjs-recruitment-task
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

Example Ingress configuration (if using Nginx Ingress Controller):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nextjs-recruitment-task
spec:
  rules:
    - host: nextjs-recruitment-task.example.com
      http:
        paths:
          - path: /
            pathType: Exact
            backend:
              service:
                name: nextjs-recruitment-task
                port:
                  number: 80
```

Apply the deployment and service to your Kubernetes cluster:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
# or if you have all YAML files in a directory
# kubectl apply -f .
```

Basic `kubectl` commands to manage your deployment:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f .
kubectl get nodes
kubectl get pods
kubectl get services
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- bash
kubectl delete deployment nextjs-recruitment-task
kubectl delete service nextjs-recruitment-task
kubectl scale deployment nextjs-recruitment-task --replicas=5
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
