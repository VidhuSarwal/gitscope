# Project Summary: GitScope

## 1. Overall Project Overview

### What is this project?
**GitScope** is a sophisticated web application designed to provide deep, intelligent insights into GitHub repositories. It serves as an automated documentation and analysis tool that transforms raw code and commit history into human-readable narratives, summaries, and technical breakdowns.

### How does it work?
The project follows a modern client-server architecture:
- **Frontend (React + Vite):** A responsive, high-performance UI built with React. It uses Tailwind CSS for styling and Framer Motion for sleek animations. It communicates with the backend via RESTful APIs to display repository data, commit timelines, and LLM-generated analysis.
- **Backend (FastAPI):** A robust Python-based API that orchestrates the core logic. It integrates with:
    - **GitHub REST API:** Fetches metadata, file trees, commit history, and code contents.
    - **LLMs (via LangChain):** Uses large language models to generate repo summaries, commit "stories," and function-level code analysis.
    - **MongoDB (Motor):** Stores user data, analysis history, and potentially cached repository information.
    - **Caching Service:** Implements caching to optimize API calls and reduce LLM costs.

### Why was it built?
The platform addresses the "context gap" when exploring new or large codebases. Instead of manually reading every file and commit, users can:
- Instantly understand the purpose and tech stack of a repo.
- See how a project evolved through narrative commit stories.
- Get a technical breakdown of every function in a file without digging through the code.

---

## 2. File-by-File Information

### Root Directory
- `Backend/`: Contains the server-side logic (FastAPI).
- `Frontend/`: Contains the client-side code (React).
- `LAbReport.pdf` / `labreport.docx`: Project documentation, likely the original requirements or research report.

---

### Backend (`/Backend`)
The backend is split into a core logical layer and a server implementation layer.

#### `Backend/server/main.py`
The primary entry point for the FastAPI application. It initializes the app, sets up CORS middleware, connects to MongoDB via a lifespan event, and includes all feature-specific routers.

#### `Backend/server/app/`
Contains the implementation logic for the server:
- `routes/`: API endpoints for Auth, Users, Repos, Commits, and LLM analysis.
- `services/`: Business logic including interaction with GitHub and LLMs.
- `models/`: Data validation and database schemas using Pydantic.
- `database.py`: MongoDB connection management.

#### `Backend/core/`
Contains core shared configurations and settings definitions.

#### `Backend/main.py`
A placeholder entry point at the root level.

---

### Frontend (`/Frontend/client`)
The frontend is a Vite-powered React application.

#### `Frontend/client/src/pages/`
- `Landing.jsx`: The public-facing landing page with high-level feature overviews and a call to action.
- `Login.jsx` / `Signup.jsx`: Secure authentication pages for user access.
- `Home.jsx`: The main dashboard where users can see their analyzed repositories.
- `RepoOverview.jsx`: A detailed view of a specific repository, showing its summary and file tree.
- `FileAnalysis.jsx`: Displays the LLM-generated breakdown of a specific code file (functions, parameters, logic).
- `CommitsStory.jsx`: A narrative visualization of the project's evolution based on commit history.
- `Settings.jsx`: Allows users to manage their profiles and API keys for LLM services.

#### `Frontend/client/src/components/`
- `Navbar.jsx`: Global navigation header.
- `FileTree.jsx`: A recursive component to visualize the repository's folder structure.
- `CommitTimeline.jsx`: A visual timeline of repository updates.
- `RepoCard.jsx`: A reusable card component for displaying repository snippets on the home page.
- `ModelKeyModal.jsx`: A modal for users to securely input their own LLM API keys.

#### `Frontend/client/src/api/`
Contains Axios configurations and API wrapper functions to communicate with the Backend.

#### `Frontend/client/src/animations/`
Stores Framer Motion configuration and reusable animation variants (e.g., fade-ins, slide-ups) to give the UI a premium feel.

---

## 3. Tech Stack Summary
- **Backend:** Python, FastAPI, MongoDB, LangChain, Pydantic, HTTPX.
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios, Lucide Icons.
- **Infrastructure:** JWT for Auth, GitHub API v3, OpenAI/Anthropic (via LangChain).
