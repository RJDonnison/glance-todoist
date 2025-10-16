# Glance Todoist Extension

This project is a simple Node.js web server designed to act as a backend for a Glance dashboard extension. It fetches tasks from the Todoist API, formats them into HTML, and serves them on different endpoints. It provides views for tasks sorted by priority and by due date, and includes functionality to mark tasks as complete.

[Docker Hub](https://hub.docker.com/repository/docker/reujdon/glance-todoist)

## Installation and Running with Docker

Follow these steps to get the application running on your local machine.

### 1. Create an Environment File

The application requires your Todoist API token to be set as an environment variable.

Create a file named `.env` in the root of your glance directory.

```bash
touch .env
```

### 2. Add Your Todoist API Token

Open the `.env` file and add your Todoist API token.

You can find your token in your Todoist account under **Settings > Integrations > Developer > API Token**.

```.env
# .env
# Add your Todoist API token below
TODOIST_API_TOKEN="YOUR_TODOIST_API_TOKEN_HERE"
```

### 3. Add to Docker Compose

Add the following to your glance `docker-compose.yml`

```yaml
glance-todoist:
  image: reujdon/glance-todoist:latest
  ports:
    - "8082:8082"
  env_file:
    - .env
  restart: always
```

### 4. Add to Glance

Add to Glance by adding the below code to your glance config.

```
- type: extension
  url: http://glance-todoist:8082/api/priority?project_id=<your_project_id>
  cache: 1m
  allow-potentially-dangerous-html: true
```

## API Endpoints

- `GET /api/priority?project_id=<id>`: Returns an HTML view of tasks sorted by priority.
- `GET /api/date?project_id=<id>`: Returns an HTML view of tasks sorted by due date.
- `POST /api/tasks/:id/close`: Marks a specific task as complete. Called by the "done" button in the HTML.

## Roadmap

1. Fix glance unable to remove tasks
