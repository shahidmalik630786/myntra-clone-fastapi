from pydantic import BaseModel
from typing import Union,Annotated
from fastapi import UploadFile

class UserSchema(BaseModel):
    username: str
    email:str
    password: str

    class Config:
        from_attributes = True

class RegisterUser(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class DeleteForm(BaseModel):
    id: str

class UpdateForm(BaseModel):
    id: int
    product_name: str
    size: str
    price: str
    

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    role: str


class RefreshToken(BaseModel):
    refresh_token: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class jwtToken(BaseModel):
    access_token: str
    refresh_token: str

class CustomOAuth2PasswordRequestForm(BaseModel):
    username: str
    password: str


class ProductsSchema(BaseModel):
    product_name: str
    size:str
    price: str
    image: bytes

    class Config:
        from_attributes = True