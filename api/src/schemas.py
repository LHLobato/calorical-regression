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


class UserSchema(BaseModel):
    id: int
    email: str
    passw: str

    class Config:
        from_attributes = True


class LoginSchema(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True


class UsuarioSchema(BaseModel):
    email: str
    name: str
    admin: Optional[bool]

    class Config:
        from_attributes = True
