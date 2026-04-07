import numpy as np
from fastapi import APIRouter, Depends, HTTPException, Request
from functions import inference
from requests import Session
from schemas import FoodSchema, MealSchema, UserSchema

from api.src.dependencies import get_session

food_router = APIRouter(prefix="/diet")


@food_router.post("/insert")
async def insert_food(
    user_schema: UserSchema,
    food_schema: FoodSchema,
    session: Session = Depends(get_session),
):

    pass
