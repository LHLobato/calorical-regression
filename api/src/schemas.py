import enum
from typing import List, Optional

from pydantic import BaseModel


class ImageSchema(BaseModel):
    image_url: str

    class Config:
        from_attributes = True


class PromptSchema(BaseModel):
    user_text: str

    class Config:
        from_attributes = True


class FoodSchema(BaseModel):
    calories: float
    protein: float
    carbs: float
    fiber: float

    class Config:
        from_attributes = True


class MealSchema(BaseModel):
    foods: List[FoodSchema]
    calories: float
    protein: float
    carbs: float
    fiber: float

    class Config:
        from_attributes = True
