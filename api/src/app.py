from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from functions import load_models, load_processors
from model_router import model_router

VISION_MODEL = "Qwen/Qwen2.5-VL-3B-Instruct"
LLM_MODEL = "Qwen/Qwen3-0.6B"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Carrega os modelos
    app.state.vlm, app.state.llm = load_models(VISION_MODEL, LLM_MODEL)
    app.state.vlm_processor, app.state.llm_processor = load_processors(
        VISION_MODEL, LLM_MODEL
    )
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "https://yourdomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(model_router)


@app.get("/")
async def main():
    return {"message": "CORS-enabled response"}
