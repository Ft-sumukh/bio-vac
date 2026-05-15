from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.v1 import surveillance
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
