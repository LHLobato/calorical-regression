import numpy as np
from fastapi import APIRouter, Request
from functions import inference
from schemas import ImageSchema, PromptSchema

model_router = APIRouter(prefix="/model", tags=["Inference"])


@model_router.post("/image")
async def send_image(request: Request, user_img_sch: ImageSchema) -> dict:
    message = inference(
        request.app.state.vlm,
        request.app.state.vlm_processor,
        flag=True,
        user_data=user_img_sch.image_url,
    )
    return {"status": "success", "message": message}


@model_router.post("/text")
async def send_prompt(request: Request, user_prompt_sch: PromptSchema) -> dict:
    message = inference(
        request.app.state.llm,
        request.app.state.llm_processor,
        flag=False,
        user_data=user_prompt_sch.user_text,
    )
    return {"status": "success", "message": message}
