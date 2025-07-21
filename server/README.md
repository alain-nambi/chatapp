# 📦 Node.js Real-Time Chat App — Development Checklist

This project is a real-time chat app using Node.js, Express, Sequelize (PostgreSQL), Redis, Socket.IO, and Docker.

---

## ✅ Project Setup

- [x] Initialize Node.js project with `pnpm`
- [x] Set up Docker & Docker Compose
- [x] Create basic Express server
- [x] Add a `/health` endpoint

---

## 🛠️ Sequelize ORM Setup

- [x] Install Sequelize, PostgreSQL, and CLI
- [x] Run `sequelize-cli init`
- [x] Configure `config/config.cjs` with `.env`
- [x] Create `User` model
- [x] Create `Message` model (with relation to `User`)
- [x] Run database migrations
- [x] (Optional) Add seeders for sample data

---

## 🧠 Redis Setup

- [ ] Add Redis to Docker Compose
- [ ] Install Redis client in Node.js (`pnpm add redis`)
- [ ] Connect to Redis and test connection

---

## ⚡ Real-Time with Socket.IO

- [ ] Install `socket.io`
- [ ] Integrate HTTP + Socket.IO in server
- [ ] Handle incoming messages
- [ ] Broadcast messages to all connected clients
- [ ] Store messages in DB with Sequelize

---

## 🧱 Models & Features

- [ ] `User` model: `username`
- [ ] `Message` model: `text`, `userId`, timestamps
- [ ] Add associations in `models/index.js`
- [ ] Add basic validation to models

---

## 📦 Docker Compose Services

- [x] PostgreSQL
- [ ] Redis
- [x] Node API (`api`)
- [x] Volumes for DB data
- [x] Bind ports for API and DB

---

## 📥 API Endpoints (Optional)

- [ ] `GET /messages` — fetch latest messages
- [ ] `POST /messages` — send message via REST
- [ ] `GET /users` — list users
- [ ] `POST /users` — create new user

---

## ✅ Other Good Practices

- [ ] Use `.env` file for configs (DB, Redis, ports, etc.)
- [ ] Use `nodemon` for dev live reload (Docker-compatible)
- [ ] Set up logging (optional)
- [ ] Error handling middleware
- [ ] Add request validation (e.g., `zod`, `joi`)

---

## 🧪 Testing (Optional)

- [ ] Install test framework (`jest`, `mocha`, etc.)
- [ ] Add tests for models and API endpoints
- [ ] Add socket event tests (integration)

---

## 🔒 Authentication (Optional / Future)

- [ ] Add user login & signup
- [ ] Use JWT for session/auth
- [ ] Secure WebSocket connections

---

## 🌐 Frontend (Optional)

- [ ] Create a simple HTML/JS interface
- [ ] Use WebSocket to receive/send messages
- [ ] Display chat messages in real time
- [ ] Show online users or status

---

## 📚 Documentation

- [ ] Write usage instructions in README
- [ ] Document environment variables
- [ ] Add diagrams for architecture (optional)

---

### 💬 Feel free to check off tasks as you complete them!
