# CodeJudge - Professional Online Code Judge Platform

An advanced, high-fidelity Online Coding Platform similar to LeetCode, featuring a secure multi-language sandbox environment via Judge0, interactive IDE dashboards, database persistence, automated difficulty-scaled scoring, and robust administrative controls.

---

## 🚀 Key Features

1. **Robust Authentication**: Secure sign-ups and login sessions mapped with `bcryptjs` password hashing and state-persistent JWT sessions (stored in HTTP-only cookies) via Zustand middleware.
2. **Interactive Monaco Workspace**: Fully featured code editor featuring high-contrast themes, dynamic language selection, custom standard inputs (stdin), live compile/runtime stderr reports, and historic compilation logs.
3. **Multi-Language Sandbox**: Secure compilation runs for Python, C++, Node.js (JavaScript), and Java using Cloud Judge0 APIs.
4. **Secure Judging Pipeline**: Sequence-checked verification against backend hidden test cases. Correct solutions are rewarded with points based on challenge difficulty levels.
5. **Topic Filtering & Searching**: Seamless dashboards listing coding questions categorized by difficulty and searchable topics (Arrays, Trees, Dynamic Programming, Stack, Graphs, Greedy, etc.).
6. **Active Global Leaderboard**: Global developer ranking system displaying user points and solved ratios.
7. **Administrative Portals**: Full admin controls to view platform-wide statistics, create/edit custom coding challenges with secure hidden test cases, and manage user accounts (block/unblock).
8. **Profile Customization**: Users can upload custom avatars (hosted on Cloudinary) and manage their account details natively within the platform.

---

## 🛠️ Technology Stack

* **Frontend**: React, Vite, Tailwind CSS v4, Monaco Editor, React Router v6, Axios, Zustand Store.
* **Backend**: Node.js, Express, MongoDB (via Mongoose), JWT, Bcryptjs, Cloudinary, Multer.
* **Compiler API**: Judge0 Extra CE (Cloud API at ce.judge0.com).

---

## 📐 Platform Architecture

Our application runs a fully decoupled frontend and backend architecture, leveraging external Cloud platforms for database, file storage, and code evaluation.

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
                        /        |         \
                       v         v          v
          +-------------+  +------------+  +-------------+
          |   MongoDB   |  | Cloudinary |  |   Judge0    | (ce.judge0.com)
          |    Atlas    |  |  (Image    |  +-------------+
          |   (Cloud)   |  |   Uploads) |         
          +-------------+  +------------+         
```

---

## ⚙️ Quick Start Installation

Ensure you have **Node.js** (v18+ recommended) installed on your workstation.

### Step 1: Set Up Backend Configuration

Navigate to the `backend` directory and configure your `.env` file to point to your cloud resources:
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=<your mongo uri>
JWT_SECRET=<your key>
JUDGE0_URL=https://ce.judge0.com

# Cloudinary Configuration for Avatar Uploads
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

### Step 2: Run the Backend Locally

Install npm dependencies and start the Express development server:
```bash
cd backend
npm install
npm run dev
```

### Step 3: Populate Database with Algorithmic Challenges (Optional)

To seed your local MongoDB database with a set of classical competitive programming questions, run the seeding command:
```bash
cd backend
npm run seed
```

### Step 4: Run the Frontend Locally

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

---

## 📡 API Endpoint Documentation

The API is structured into three main modules: `common-api`, `user-api`, and `admin-api`.
Requests to protected endpoints require a valid JWT stored in a secure HTTP-only cookie.

### 🔐 Authentication (`/api/common-api`)
* `POST /register`: Registers a new user account.
* `POST /login`: Authenticates the user and sets an HTTP-only JWT cookie.
* `GET /logout`: Clears the authentication token cookie.

### 👤 User Operations (`/api/user-api`)
* `GET /profile`: Retrieves the current user's profile details and solved stats.
* `PUT /edit-profile`: Updates the user's profile information.
* `POST /upload-avatar`: Uploads a profile image to Cloudinary and returns the secure URL.
* `GET /problems`: Lists all active coding challenges (excludes hidden test cases).
* `GET /problem/:problemId`: Retrieves specific problem details (excludes hidden test cases).
* `POST /run`: Sandbox dry-runs code against the problem's sample test cases and custom inputs.
* `POST /submit`: Processes and judges the code across all hidden test cases. Awards points on success.
* `GET /submissions`: Fetches the historic log of the user's personal submissions.
* `GET /submissions/:submissionId`: Retrieves full details of a specific past submission.
* `GET /solved-problems`: Lists all problems successfully solved by the user.
* `GET /leaderboard`: Obtains the global sorted standings of all active programmers.

### 🛡️ Administrative Console (`/api/admin-api`)
*(All endpoints require Admin Privileges)*
* `GET /problems`: Retrieves all coding challenges (including hidden test cases) for admin auditing.
* `POST /problems`: Creates a new coding problem (requires at least 3 hidden test cases).
* `PUT /problems/:problemId`: Updates an existing coding problem.
* `DELETE /problems/:problemId`: Soft deletes a problem (sets `isProblemActive` to false).
* `GET /leaderboard`: Administrative version of the leaderboard showing all users (active/inactive) and their registration dates.
* `PUT /block-user/:userId`: Disables a user account.
* `PUT /unblock-user/:userId`: Re-enables a disabled user account.

---

## 🎖️ Algorithmic Reward Ranks

Solutions that pass all hidden test cases award the user difficulty-scaled experience points:
* **Easy Tasks**: `+10 Points`
* **Medium Tasks**: `+20 Points`
* **Hard Tasks**: `+30 Points`

**Tier Badges** automatically level up as points accumulate:
* **Rank 1**: `0 - 99 pts`
* **Rank 2**: `100 - 199 pts`
* **Rank 3**: `200 - 299 pts`
*(Level ranks increment by 1 for every 100 experience points gained).*