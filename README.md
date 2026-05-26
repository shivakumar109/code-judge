# CodeJudge - Professional Online Code Judge Platform

An advanced, high-fidelity Online Coding Platform similar to LeetCode, featuring a secure multi-language sandbox environment via dockerized Judge0, interactive IDE dashboards, database persistence, automated difficulty-scaled scoring, and full-stack multi-container Docker Compose setup.

---

## 🚀 Key Features

1. **Robust Authentication**: Secure sign-ups and login sessions mapped with `bcryptjs` password hashing and state-persistent JWT sessions via Zustand middleware.
2. **Interactive Monaco Workspace**: Fully featured code editor featuring high-contrast themes, dynamic language selection, custom standard inputs (stdin), live compile/runtime stderr reports, and historic compilation logs.
3. **Multi-Language Sandbox**: Sandbox-secure compilation runs for Python, C++, Node.js (JavaScript), and Java using self-hosted Judge0 APIs.
4. **Secure Judging Pipeline**: Sequence-checked verification checks against backend hidden test cases. Correct solutions are rewarded with points based on challenge difficulty levels.
5. **Topic Filtering & Searching**: Seamless dashboards listing 50 seeded questions categorized by difficulty and searchable topics (Arrays, Trees, Dynamic Programming, Stack, Graphs, Greediness, etc.).
6. **Active Global Leaderboard**: Global developer ranking system displaying user points and solved ratios, celebrating the top three developers inside podium blocks.
7. **Administrative Portals**: Full admin controls to view live platform-wide statistics, create custom coding challenges with multiple secure hidden test cases, and manage existing directories.

---

## 🛠️ Technology Stack

* **Frontend**: React, Vite, Tailwind CSS v4, Monaco Editor, React Router v6, Axios, Zustand Store.
* **Backend**: Node.js, Express, MongoDB (via Mongoose), JWT, Bcryptjs.
* **DevOps**: Docker, Docker Compose (for sandboxed Judge0 execution only: PostgreSQL and Redis).

---

## 📐 Platform Architecture

Our local development architecture runs the web client and application server locally, leveraging a cloud database and self-hosted Judge0 compiler sandbox running in Docker:

```
                       +-------------------+
                       |  React Frontend   | (Runs locally on :5173)
                       +-------------------+
                                 |
                                 |  [Communicates with Backend]
                                 v
                       +-------------------+
                       |  Node.js Backend  | (Runs locally on :5000)
                       +-------------------+
                          /      |      \
                         /       |       \
      [Connects / Stores]        |        [Requests evaluations]
                        /         |         \
                       v          v          v
          +-------------+   +-----------+   +-------------+
          |   MongoDB   |   | PostgreSQL|   |   Judge0    | (Sandbox executing in Docker on :2358)
          |    Atlas    |   | (Docker   |   +-------------+
          |   (Cloud)   |   |  relational  |      |       |
          +-------------+   |  metadata)|      |       |  [Schedules / pulls tasks]
                            +-----------+      v       v
                                             +---------------+
                                             |  Redis Queue  | (Docker)
                                             +---------------+
```

---

## ⚙️ Quick Start Installation

Ensure you have **Node.js** (v18+ recommended), **Docker**, and **Docker Compose** installed on your workstation.

### Step 1: Set Up Backend Configuration

Configure your `backend/.env` file in the backend root directory to point to your local MongoDB:
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/codejudge
JWT_SECRET=supersecretkey
JUDGE0_URL=http://127.0.0.1:2358
```

### Step 2: Spin Up Judge0 (Docker)

Execute the compose command from the root directory to launch the Judge0 service and its database dependencies:
```bash
docker compose up -d
```
This launches Redis, PostgreSQL, Judge0, and the Judge0 Worker in the background.

### Step 3: Run the Backend Locally

Navigate to the `backend` folder, install npm dependencies, and start the Express development server:
```bash
cd backend
npm install
npm run dev
```

### Step 4: Populate Database with 50 Algorithmic Challenges

To seed your local MongoDB database with the 50 classical competitive programming questions (30 Easy, 15 Medium, 5 Hard), run the seeding command locally:
```bash
cd backend
npm run seed
```

Once executed successfully, you'll see connection metrics logged:
```bash
Seeding Database...
Connected to MongoDB: mongodb://localhost:27017/codejudge
Cleared existing problems.
Successfully seeded 50 coding problems!
Database connection closed.
```

### Step 5: Run the Frontend Locally

Navigate to the `frontend` folder, install the client dependencies, and start the React/Vite development server:
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Active System Portals

Once the platform components are online, open the following endpoints on your computer:
* **React Web client**: [http://localhost:5173](http://localhost:5173)
* **Backend Health Checker**: [http://localhost:5000/health](http://localhost:5000/health)
* **Judge0 Status Endpoint**: [http://localhost:2358/statuses](http://localhost:2358/statuses)

---

## 📡 API Endpoint Documentation

All non-auth requests require the header `Authorization: Bearer <JWT_TOKEN>`.

### 🔐 Authentication (`/api/auth`)
* `POST /register`: Registers new user. Payload: `{ username, email, password }`.
* `POST /login`: Logs in user, returns token and profile context. Payload: `{ email, password }`.
* `GET /me`: Obtains current active user stats and solved list.
* `GET /leaderboard`: Obtains sorted standings of all programmers in the system.

### 📚 Problem Management (`/api/problems`)
* `GET /`: Lists all problems. Query parameters: `?search=<term>&tag=<tag>&difficulty=<Easy|Medium|Hard>`. (Excludes hidden test cases for security).
* `GET /:id`: Retrieves single problem description. (Excludes hidden test cases).
* `POST /`: Admin only. Submits new coding challenge. Payload: `{ title, difficulty, tags, description, constraints, inputFormat, outputFormat, sampleInput, sampleOutput, explanation, hiddenTestCases: [{ input, output }] }`.
* `DELETE /:id`: Admin only. Permanently deletes challenge from database.

### 💻 Code Compilation Pipeline (`/api/submissions`)
* `POST /run`: Sandbox-runs code draft with custom standard input (stdin). Payload: `{ code, language, stdin }`. Returns: `{ status, stdout, stderr, compileOutput, runtime, memory }`.
* `POST /submit`: Processes and judges solution across all hidden test cases. Payload: `{ problemId, code, language }`. Returns: `{ success, failedAt, totalCases, status, compileOutput, stderr, runtime, memory, pointsAwarded }`.
* `GET /my`: Retrieves full historic log of user's personal submissions.
* `GET /problem/:problemId`: Retrieves user's attempts history for a specific challenge.

### 🛡️ Administrative Console (`/api/admin`)
* `GET /users`: Admin only. Fetches full user roster with solved problems and scores.
* `GET /stats`: Admin only. Returns platform count variables and compile status charts.

---

## 🎖️ Algorithmic Reward Ranks

Solutions that pass all hidden tests award the user difficulty-scaled experience points, updating their level tier:
* **Easy Tasks**: `+10 Points`
* **Medium Tasks**: `+20 Points`
* **Hard Tasks**: `+30 Points`

* **Tier Badges**:
  * **0 - 49 pts**: `Newbie`
  * **50 - 199 pts**: `Pupil`
  * **200 - 499 pts**: `Expert`
  * **500 - 999 pts**: `Master`
  * **1000+ pts**: `Grandmaster`
