from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: str # Thêm email vào schema cơ bản

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    class Config:
        from_attributes = True

class PhotoBase(BaseModel):
    title: str
    url: str

class Photo(PhotoBase):
    id: int
    owner_id: int
    is_deleted: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict