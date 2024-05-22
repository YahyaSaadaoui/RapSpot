```markdown
# Next.js Supabase Application with Docker

This repository contains a Next.js application connected to a Supabase database and storage. The application is containerized using Docker for easy setup and deployment.

## Prerequisites
- Node 20 or higher
- Docker installed on your machine. [Get Docker](https://www.docker.com/get-started)
- A Supabase project with the necessary API URL and anonymous key.

## Setup

### 1. Clone the Repository
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Create an `.env` File

Create a `.env` file in the root directory of the project with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-url` and `your-supabase-anon-key` with your actual Supabase project credentials.

### 3. Build and Run the Docker Container

#### Method 1: Using Docker CLI

1. **Build the Docker Image**:

    ```sh
    docker build -t nextjs-supabase-app .
    ```

2. **Run the Docker Container**:

    ```sh
    docker run -p 3000:3000 --env-file .env nextjs-supabase-app
    ```

#### Method 2: Using Docker Compose

1. **Create a `docker-compose.yml` File**:

    ```yaml
    version: '3'
    services:
      nextjs:
        image: nextjs-supabase-app
        build: .
        ports:
          - '3000:3000'
        env_file:
          - .env
    ```

2. **Build and Start the Services**:

    ```sh
    docker-compose up --build
    ```

## Access the Application

Once the container is running, open your browser and go to:

```
http://localhost:3000
```

You should see your Next.js application running.

## Pushing to Docker Hub

To share the Docker image, you can push it to Docker Hub.

1. **Login to Docker Hub**:

    ```sh
    docker login
    ```

2. **Tag the Image**:

    ```sh
    docker tag nextjs-supabase-app your-dockerhub-username/nextjs-supabase-app
    ```

3. **Push the Image**:

    ```sh
    docker push your-dockerhub-username/nextjs-supabase-app
    ```

4. **Share the Image**:

    Share the Docker image link (e.g., `docker pull your-dockerhub-username/nextjs-supabase-app`) with others so they can run the container locally.

## Security Considerations

- Ensure your `.env` file is listed in `.gitignore` and `.dockerignore` to prevent sensitive information from being committed to your version control or included in the Docker image.

    **.gitignore**:
    ```gitignore
    .env
    ```

    **.dockerignore**:
    ```dockerignore
    .env
    node_modules
    npm-debug.log
    Dockerfile
    .dockerignore
    ```

## License

[![license](https://img.shields.io/github/license/helloukey/mymovies?style=for-the-badge)](LICENSE)