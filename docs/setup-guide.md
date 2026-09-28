# VIRASAT — Local Setup & Deployment Guide

This guide details steps to configure, run, and test the full-stack VIRASAT platform locally and in containerized environments.

---

## 1. Prerequisites

- **Python:** 3.11+ (Python 3.14 recommended)
- **Node.js:** v20+ LTS (Node v24 tested)
- **npm:** 10+
- **Docker & Docker Compose** (Optional, for containerized deployment)

---

## 2. Quick Local Start (Development Mode)

### Step 1: Environment Variables
From the repository root:
```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

### Step 2: Backend Setup & Seed
```bash
cd backend
python -m pip install -r requirements.txt
python scripts/seed_database.py
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`.  
OpenAPI documentation is available at `http://127.0.0.1:8000/docs`.

### Step 3: Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start at `http://localhost:5173`.

---

## 3. Single-Command Docker Deployment

To launch the complete stack (PostgreSQL + FastAPI Backend + React/Nginx Frontend):
```bash
docker compose up --build
```
Access the application:
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`
- **API Docs:** `http://localhost:8000/docs`

---

## 4. Running Test Suites

### Backend Unit & Integration Tests (pytest)
```bash
cd backend
pytest app/tests -v
```

### Frontend Typecheck & Build Verification
```bash
cd frontend
npm run lint
npm run build
```
