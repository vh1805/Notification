# QueueNotify

A minimal Node.js project demonstrating RabbitMQ publishers and consumers alongside an Express API, JWT auth, and email notifications.

**Features**

- **RabbitMQ**: publishers and consumers implemented under the `RabbitMQ/` folder.
- **Express API**: API entry in `src/index.js` with routes under `routes/`.
- **Authentication**: JWT-based authentication in `jwt/` and `validation/`.
- **Email**: Email service and publisher in `service/` and `RabbitMQ/publisher/`.

**Prerequisites**

- Node.js v16+ (or compatible)
- npm
- RabbitMQ (local or via Docker Compose)
- MongoDB (if you intend to use the included Mongoose models)

**Environment variables**
Create a `.env` file in the project root with values for at least:

- `PORT` (optional, defaults to 3000)
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (secret for signing tokens)
- `RABBITMQ_DEFAULT_USER` / `RABBITMQ_DEFAULT_PASS` / `RABBITMQ_ERLANG_COOKIE` (used by docker-compose)
- `RABBITMQ_URL` (amqp:// user:pass@host:5672)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` (for nodemailer)

**Install**

```bash
npm install
```

**Run (local)**

Start RabbitMQ (recommended via Docker Compose):

```bash
docker-compose up -d
```

Start the app:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The API will be available on `http://localhost:3000` (or the `PORT` you set).

**Project structure (high level)**

- `src/` — application entry and setup (`src/index.js`)
- `routes/` — Express routes (e.g., [routes/user.js](routes/user.js))
- `controller/` — request handlers (e.g., [controller/user.js](controller/user.js))
- `model/` — Mongoose models (e.g., [model/user.js](model/user.js))
- `service/` — domain services (e.g., `EmailService.js`)
- `RabbitMQ/` — connection, publishers, and consumers

**Notes & next steps**

- Ensure `MONGO_URI` points to a running MongoDB instance if you use the models.
- Adjust `RABBITMQ_URL` or use the docker-compose variables to match your RabbitMQ credentials.
- Add any missing environment variables to `.env` and secure them in production.

**License**
MIT
