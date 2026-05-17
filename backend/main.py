from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
from routes.v1 import surveillance, assistant, forecasting, convergence, dynamics, immunity, adjuvant
from config.settings import settings
from monitoring.logging import logger

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS configuration
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include Routers
    application.include_router(
        surveillance.router, 
        prefix=f"{settings.API_V1_STR}/surveillance", 
        tags=["Surveillance"]
    )
    application.include_router(
        assistant.router, 
        prefix=f"{settings.API_V1_STR}/assistant", 
        tags=["AI Assistant"]
    )
    application.include_router(
        forecasting.router, 
        prefix=f"{settings.API_V1_STR}/forecasting", 
        tags=["Evolution Forecasting"]
    )
    application.include_router(
        convergence.router, 
        prefix=f"{settings.API_V1_STR}/convergence", 
        tags=["Multi-Pathogen Convergence"]
    )
    application.include_router(
        dynamics.router, 
        prefix=f"{settings.API_V1_STR}/dynamics", 
        tags=["Structural Dynamics Sandbox"]
    )
    application.include_router(
        immunity.router, 
        prefix=f"{settings.API_V1_STR}/immunity", 
        tags=["Immunological Memory Atlas"]
    )
    application.include_router(
        adjuvant.router, 
        prefix=f"{settings.API_V1_STR}/adjuvant", 
        tags=["AI Adjuvant Matchmaker"]
    )

    @application.on_event("startup")
    async def startup_event():
        logger.info("BI-VAC AI Engine Starting Up...")

    @application.get("/health")
    async def health_check():
        return {"status": "healthy", "service": settings.PROJECT_NAME}

    @application.get("/")
    async def root():
        return {
            "message": "Welcome to BI-VAC AI Healthcare Intelligence Platform",
            "api_version": "v1",
            "docs": "/docs"
        }

    return application

app = create_application()
