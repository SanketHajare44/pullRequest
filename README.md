<div align="center">

# PullRequest

### Developer Networking & Real-Time Communication Platform

<p>
  A full-stack platform where developers can discover other developers,
  build connections, manage requests, and communicate through real-time chat.
</p>

<p>
<a href="https://pullrequest-roan.vercel.app">
<strong>Live Demo →</strong>
</a>
&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="https://github.com/SanketHajare44/pullRequest">
<strong>Repository</strong>
</a>
</p>

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io&logoColor=white)

</div>

---

## Overview

PullRequest is a full-stack developer networking platform built to help developers discover people with similar interests, create professional connections, and communicate through real-time messaging.

The application provides a complete user flow:

```text
Create Account
      │
      ▼
    Login
      │
      ▼
Developer Feed
      │
      ├───────────────┐
      │               │
      ▼               ▼
 Interested        Ignored
      │
      ▼
Connection Request
      │
      ├───────────────┐
      │               │
      ▼               ▼
   Accepted        Rejected
      │
      ▼
Connections
      │
      ▼
    Chat
      │
      ▼
Real-Time Messaging
```

---

## Features

- **Authentication** — Secure signup/login with cookie-based sessions
- **Developer Feed** — Browse other developers' profiles one at a time
- **Connection Requests** — Send, accept, or reject requests to connect
- **Connections** — View and manage your accepted connections
- **Real-Time Chat** — Message connections instantly via Socket.IO
- **Profile Management** — Edit profile details and photo

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React 19
- Vite 7
- Tailwind CSS + DaisyUI
- Redux / React Redux
- React Router
- Axios
- Socket.IO Client

</td>
<td valign="top" width="50%">

**Backend**
- Node.js 24
- Express 5
- MongoDB + Mongoose
- Socket.IO
- JSON Web Tokens (JWT)
- bcrypt

</td>
</tr>
</table>

---

## Architecture

```
┌──────────────────┐        REST API (HTTPS)         ┌──────────────────┐
│                   │  ─────────────────────────────▶ │                  │
│    Frontend        │                                 │    Backend        │
│  React + Vite       │  ◀───────────────────────────  │  Node + Express    │
│                   │       JSON + HTTP-only cookie    │                  │
└─────────┬─────────┘                                 └────────┬─────────┘
          │                                                     │
          │              WebSocket (Socket.IO)                  │
          └─────────────────────────────────────────────────────┘
                                                                  │
                                                                  ▼
                                                        ┌──────────────────┐
                                                        │     MongoDB        │
                                                        │   (Mongoose ODM)    │
                                                        └──────────────────┘
```

- **REST API** handles auth, profile, feed, requests, and connections
- **Socket.IO** handles real-time chat delivery between connected users
- **JWT stored in an HTTP-only cookie** authenticates both REST requests and the socket handshake

---

## Project Structure

```
pullRequest/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Body.jsx           # Layout wrapper (NavBar + Outlet + Footer)
│       │   ├── NavBar.jsx
│       │   ├── Footer.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Feed.jsx
│       │   ├── Connections.jsx
│       │   ├── Request.jsx
│       │   ├── Chat.jsx
│       │   └── ProfileEdit.jsx
│       ├── utils/
│       │   ├── appStore.js         # Redux store config
│       │   ├── userSlice.js
│       │   ├── connectionSlice.js
│       │   └── constant.js         # BASE_URL and constants
│       └── App.jsx                 # Route definitions
│
└── backend/
    └── src/
        ├── models/                 # Mongoose schemas (User, ConnectionRequest, Chat, Message)
        ├── routes/                 # Express route handlers
        ├── middlewares/            # Auth middleware, error handling
        ├── utils/                  # Socket.IO setup, validation helpers
        └── app.js                  # Express app entry point
```

---

## API Reference

| Method | Endpoint                          | Description                          |
|--------|------------------------------------|----------------------------------------|
| POST   | `/signup`                          | Register a new user                    |
| POST   | `/login`                           | Log in, sets auth cookie               |
| POST   | `/logout`                          | Clear auth cookie                      |
| GET    | `/profile/view`                    | Get the logged-in user's profile       |
| PATCH  | `/profile/edit`                    | Update profile details                 |
| GET    | `/feed`                            | Get developer profiles to browse       |
| POST   | `/request/send/:status/:userId`    | Send interested/ignored request        |
| POST   | `/request/review/:status/:requestId` | Accept/reject an incoming request     |
| GET    | `/user/requests/received`          | List incoming connection requests      |
| GET    | `/user/connections`                | List accepted connections              |

> Adjust routes above to exactly match your backend if they differ.

### Socket.IO Events

| Event            | Direction        | Description                          |
|-------------------|-------------------|----------------------------------------|
| `joinChat`         | Client → Server    | Join a chat room with a connection     |
| `sendMessage`       | Client → Server    | Send a new message                     |
| `messageReceived`    | Server → Client     | Broadcast a new message to the room    |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas connection string)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/SanketHajare44/pullRequest.git
cd pullRequest
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment variables

**`backend/.env`**
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**`frontend/src/utils/constant.js`**
```js
export const BASE_URL = "http://localhost:3000";
```

### 4. Run the app

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

The app will be running at:

```
http://localhost:5173
```

---

## Roadmap

- [ ] Filter feed by tech stack / experience level
- [ ] Push notifications for new requests and messages
- [ ] Read receipts and typing indicators in chat
- [ ] Mobile-responsive polish

---

## Author

**Sanket Hajare**
[GitHub](https://github.com/SanketHajare44) · [Live Demo](https://pullrequest-roan.vercel.app)

---

## License

This project is available for personal and portfolio use. Add an open-source license here (MIT recommended) if you plan to make the repository public for contributions.