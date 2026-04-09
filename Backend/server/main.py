from fastapi import FastAPI
from app.database import db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.connect()
    yield
    db.close()

app = FastAPI(title="GitHub Analysis Platform", lifespan=lifespan)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.repo_routes import router as repo_router
from app.routes.commits_routes import router as commits_router
from app.routes.llm_routes import router as llm_router

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(repo_router)
app.include_router(commits_router)
app.include_router(llm_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the GitHub Analysis Platform API"}
