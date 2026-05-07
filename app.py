import uvicorn
from vewp.main import app

# This file is the entry point for deployment.
# It exposes the FastAPI 'app' instance from the vewp package.

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
