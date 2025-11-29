The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Cron Reminders

- Endpoint: `GET/POST /api/jobs`
- Auth: set `CRON_SECRET` in env and send either `Authorization: Bearer <CRON_SECRET>` or header `x-cron-secret: <CRON_SECRET>`.

Example curl:

```sh
curl -X POST "http://localhost:3000/api/jobs" \
	-H "Authorization: Bearer $CRON_SECRET"
```

### Platform setup (examples)

- Vercel: add a Cron Job to call `/api/jobs` every 15 minutes and set `CRON_SECRET` in Project Env Vars.
- GitHub Actions: schedule a workflow that hits the endpoint with the secret header.
- Any external cron: ping the endpoint with the same header.

This triggers the event-centric scheduler that sends 24h-before reminders and marks them as sent.

## Rate Limiting

- In-memory by default; configurable per-endpoint.
- To enable Redis-backed limits across instances, set `REDIS_URL` (or platform-provided URL) and redeploy.
- Current limits:
	- Subscribe: 20 req/10 min per IP; 5 req/hour per email
	- Unsubscribe: 30 req/10 min per IP; 10 req/hour per email
	- Cron: 4 calls/minute (global)