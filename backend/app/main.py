from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_tables
from app.routers import auth, classes, checkin, location, emergency

app = FastAPI(
    title="MyCampus API",
    description="Navigate. Connect. Stay Safe.",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://mycampus.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(checkin.router, prefix="/api/checkin", tags=["Check-in"])
app.include_router(location.router, prefix="/api/location", tags=["Location"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])


@app.on_event("startup")
async def startup():
    create_tables()


@app.get("/")
def root():
    return {
        "app": "MyCampus API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "ok"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
