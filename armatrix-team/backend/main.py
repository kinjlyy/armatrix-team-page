import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import init_db
from routes.team import router as team_router

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

app = FastAPI(
    title="Armatrix Team API",
    description="REST API for Armatrix team members",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(team_router, prefix="/team", tags=["team"])
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {"message": "Armatrix Team API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/upload/photo", tags=["upload"])
async def upload_photo(file: UploadFile = File(...)):
    """
    Upload a profile photo.
    Returns a URL pointing to the stored file.
    Accepts: JPEG, PNG, WebP, GIF — max 5 MB.
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: JPEG, PNG, WebP, GIF.",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5 MB.")

    ext = os.path.splitext(file.filename or "photo.jpg")[1].lower() or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(UPLOAD_DIR, filename)
    with open(dest, "wb") as f:
        f.write(contents)

    return {
        "filename": filename,
        "url": f"/uploads/{filename}",
        "size": len(contents),
        "content_type": file.content_type,
    }


@app.delete("/upload/photo/{filename}", tags=["upload"])
async def delete_photo(filename: str):
    """Delete an uploaded photo by filename."""
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")
    path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found.")
    os.remove(path)
    return {"deleted": filename}
