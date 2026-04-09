# 🔍 GitScope

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**GitScope** is an AI-powered platform that transforms complex GitHub repositories into understandable stories and technical documentation. Using Large Language Models (LLMs), it analyzes codebases to provide high-level summaries, evolution narratives, and detailed function breakdowns.

---

## ✨ Features

- 📝 **Intelligent Summarization:** Get a 2-3 sentence overview of any repo, including key technologies and core functionalities.
- 📖 **Commit Evolution Stories:** Watch your project's history turn into an engaging narrative.
- 📂 **Automated Code Analysis:** Deep dive into files to see function lists, parameters, and technical logic without reading every line.
- 🌳 **Interactive File Tree:** Seamlessly navigate through complex repository structures.
- 🔐 **Secure Key Management:** Bring your own API keys for LLM analysis (OpenAI, Gemini, etc.).

---

## 🚀 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Clsx](https://github.com/lukeed/clsx)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (unstructured data) & [ChromaDB](https://www.trychroma.com/) (vector storage)
- **AI Orchestration:** [LangChain](https://www.langchain.com/)
- **API Client:** [HTTPX](https://www.python-httpx.org/) (async)
- **Parsing:** [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) (deep code understanding)

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/VidhuSarwal/gitscope.git
cd gitscope
```

### 2. Backend Setup
```bash
cd Backend/server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in `Backend/server/` with:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_optional_github_personal_access_token
```

### 3. Frontend Setup
```bash
cd Frontend/client
npm install
```

### 4. Running the Project
**Start Backend:**
```bash
# In Backend/server
uvicorn main:app --reload
```
**Start Frontend:**
```bash
# In Frontend/client
npm run dev
```

---

## 📸 Screenshots

| Dashboard | Repository Overview | File Analysis |
| :---: | :---: | :---: |
| ![Dashboard](https://via.placeholder.com/300x200?text=Dashboard) | ![Overview](https://via.placeholder.com/300x200?text=Repo+Overview) | ![Analysis](https://via.placeholder.com/300x200?text=File+Breakdown) |

*(Note: Replace with actual screenshots from your app)*

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ by Vidhu Sarwal</p>
