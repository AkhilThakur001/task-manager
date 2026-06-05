# Task Manager

A full-stack personal task manager built with Node.js + Express on the backend and React on the frontend. Users can create, view, update, and delete tasks, filter by status, search by title, and see overdue tasks highlighted.

## Live Demo
## Live Demo
- Frontend: https://task-manager-1hnc0yrui-akhilthakur001s-projects.vercel.app
- Backend: https://task-manager-api-t14k.onrender.com

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite | Fast dev server, modern tooling |
| Styling | Tailwind CSS | Utility-first, clean UI with minimal effort |
| HTTP Client | Axios | Clean API calls with error handling |
| Backend | Node.js + Express | Simple, fast REST API |
| Storage | JSON file | Lightweight persistence, no DB setup needed |
| Dev Tool | Nodemon | Auto-restarts server on file changes |

## How to Run Locally

Make sure you have Node.js installed.

### 1. Clone the repo
```bash
git clone https://github.com/AkhilThakur001/task-manager.git
cd task-manager
```

### 2. Start the backend
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:3001

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## API Documentation

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | /api/tasks | - | Array of all tasks |
| POST | /api/tasks | `{ title, description?, dueDate? }` | Created task |
| PATCH | /api/tasks/:id | `{ title?, description?, dueDate?, completed? }` | Updated task |
| DELETE | /api/tasks/:id | - | `{ message }` |

### Task Object Shape
```json
{
  "id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-06-10",
  "completed": false,
  "createdAt": "2026-06-05T00:00:00.000Z"
}
```

## Project Structure