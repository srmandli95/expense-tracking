from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging_config import setup_logging, get_logger
from app.middleware.logging import LoggingMiddleware
from app.routers import auth, expenses, analytics
from app.database import init_db


setup_logging()
logger = get_logger("main")

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)


app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(analytics.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup")
    init_db()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown")

@app.get("/health")
def health_check():
    return {"status": "ok"}

