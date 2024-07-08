from fastapi import APIRouter,HTTPException,status,Request,Form,UploadFile,File
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from schemas import UserSchema,ProductsSchema,RegisterUser,LoginRequest,DeleteForm
from fastapi import Depends
from operations import user_login,Database
from datetime import datetime, timedelta
from hashing import hashed_password, verify_password
import jwt
import base64
import io
from jwt.exceptions import InvalidTokenError
from typing import Annotated
import os
import uuid
import random
import ast
from jose import jwt, JWTError,ExpiredSignatureError
from passlib.context import CryptContext
from schemas import UserSchema,Token,CustomOAuth2PasswordRequestForm,TokenData,jwtToken,RefreshToken,UpdateForm
from sqlalchemy.orm import Session
from token_utils import create_access_token,create_refresh_token
import shutil
from fastapi import Security
from fastapi.security import HTTPBearer
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from fastapi.responses import JSONResponse




ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 *7 # 7 days
ALGORITHM = "HS256"
JWT_SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"  
JWT_REFRESH_SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e712"  


oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="token")


STATIC_DIR = "static"

bearer_scheme = HTTPBearer()

# Folder to save images
# UPLOAD_FOLDER = 'images'
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# auth = Authorization()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(tags=['Authentication'])

templates = Jinja2Templates(directory="templates")




# GET
@router.get('/register',response_class=HTMLResponse)
async def register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request, "products": "products"})



#GET
@router.get('/login',response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request, "title": "sign up"})



# LOGOUT
@router.get('/logout', response_class=HTMLResponse)
async def logout(request: Request):
    return RedirectResponse(url="/login")


# Insert Products

@router.get('/insert_product',response_class=HTMLResponse)
async def insert_products(request: Request):
    return templates.TemplateResponse("product_insert.html", {"request": request, "title": "Insert Product"})



#cart
@router.get('/cart',response_class=HTMLResponse)
async def cart(request:Request):
    return templates.TemplateResponse("cart.html",{"request":request, "title":"cart"})



async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    print(token,"****get_current_user*******access token**************")
 
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
        user_model = Database()
        query = "SELECT * FROM user WHERE username = %s"
        params = (token_data.username,)
        user_data = user_model.database_operation((query, params))
        user = user_data.get("success")
        print(user,"**************user*****************")
        if user is None:
            raise credentials_exception
        return user
    
    
    except ExpiredSignatureError:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )  
    except InvalidTokenError:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    except JWTError:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
        )



    

#ADMIN PANEL
@router.get('/admin',response_class=HTMLResponse)
async def admin(request: Request):
    return templates.TemplateResponse("admin.html",{"request": request, "products": "products"})


"""API LOGIC"""

#Login
@router.post('/api/login',response_model=Token,tags=['Authentication'])
async def login(form_data: LoginRequest):
    user_model = Database()
    query = "SELECT * FROM user WHERE username = %s"
    params = (form_data.username,)
    user_data = user_model.database_operation((query, params))
    user = user_data.get("success")
    print(user_data.get("data")[0][4],"****************************&&&")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    role = (user_data.get("data")[0][-1])
    hashed_password_from_db = user_data.get("data")[0][4]
   
    if not verify_password(form_data.password, hashed_password_from_db):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        print("password verified")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user_data.get("data")[0][1], expires_delta=access_token_expires)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_refresh_token(user_data.get("data")[0][1], expires_delta=refresh_token_expires)
    print(access_token,"access token***********")
    print(refresh_token,"refresh token***********")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role":role,
    }


# Register
@router.post('/api/register', response_model=UserSchema, tags=['Authentication'])
def register(user: RegisterUser):
    user_model = Database()

    # Check if user with provided username already exists
    existing_user_query = "SELECT * FROM user WHERE username=%s"
    existing_user_params = (user.username,)
    existing_user = user_model.database_operation((existing_user_query, existing_user_params))
    data=(existing_user.get("data"))
    if data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this username already exists")

    # Hash the password before storing it in the database
    hashed_password_str = hashed_password(user.password)

    # Insert new user data into the database
    insert_user_query = "INSERT INTO user (username, email, password) VALUES (%s, %s, %s)"
    insert_user_params = (user.username, user.email, hashed_password_str)
    db_user = user_model.database_operation((insert_user_query, insert_user_params))

    # Return the newly registered user's information
    return {"username": user.username, "email": user.email, "password": hashed_password_str}




# Get all product
@router.get("/api/get_all_product/limit/{limit}/page/{page}")
def get_all_product(limit:int,page:int,access_token: str = Depends(get_current_user)):
    try:
        start =(limit * page) - limit
        print(start,"*************start******************8")
        product_model = Database()
        if page == 1:
            query = "SELECT * FROM products ORDER BY id LIMIT %s "
            params = (limit,)
            product_data = product_model.database_operation((query, params))
        else:
            query = "SELECT * FROM products LIMIT %s OFFSET %s"
            params = (limit,start,)
            product_data = product_model.database_operation((query, params))

        
        products = product_data.get("data")
        print(products,"*****************products********************")
        product_list = []
        if products:
            for product in products:
                product_id = product[0]
                name = product[1]
                size = product[2] 
                price = product[3]
                image_path = product[4]
                product_list.append({'id': product_id, 'name': name,"size":size,"price":price,"image_path":image_path})
            prod_count = product_model.get_product_count()
            product_count=prod_count.get("data")[0][0]
            print(product_count,"***************product_count****************")
            return {"product":product_list,"product_count":product_count}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No products",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


# Insert
@router.post("/api/insert_product")
def insert_product(product_name:Annotated[str,Form(...)],
                   size:Annotated[str,Form(...)],
                   price: Annotated[str,Form(...)],
                   image: Annotated[UploadFile,File(...)],
                   current_user: UserSchema = Depends(get_current_user)):
    try:
        random_number = random.randint(1000, 9999)
        product_folder = "product" + str(random_number)
        image_folder = f"static/product_images/{product_folder}"
        
        os.makedirs(image_folder, exist_ok=True)
        
        # Generate unique name for the image
        image_name = str(uuid.uuid4()) + ".jpg"
        image_path = os.path.join(image_folder, image_name)
        
        # Save the uploaded file
        with open(image_path, "wb") as buffer:
            buffer.write(image.file.read())
        
        product_model = Database()
        img_path = image_path.replace('static/', '', 1)
        query = 'INSERT INTO products (product_name, size, price, image_path) VALUES (%s, %s, %s, %s)'
        params = (product_name, size, price, img_path)
        product_data = product_model.database_operation((query, params))
        
        if product_data.get("success"):
            return {"message": "Data successfully inserted"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error: No product was inserted"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )
    

#Delete
@router.delete("/api/delete_product/{id}")
async def delete_product(id:int,access_token: str = Depends(get_current_user)):
    product_model = Database()
    #code for delete product image from image folder
    query='select image_path from products WHERE id=%s'
    params = (id,)
    product_data = product_model.database_operation((query,params))
    image_path = product_data.get("data")
    print(image_path,"**************image_path************88")
    directory = image_path[0][0]
    prefix = directory.split('/')[0:2]
    print(prefix,"************************88")
    prefix = str('/'.join(prefix))
    folder_path = os.path.join(STATIC_DIR, prefix)
    shutil.rmtree(folder_path)

    #code for delete product from table
    query = 'DELETE FROM products WHERE id=%s'
    params = (id,)
    product_data = product_model.database_operation((query, params))
    if not product_data.get("success"):
        raise HTTPException(status_code=400, detail=product_data.get("msg"))
    return {"message": "Product deleted successfully"}


#update
@router.put("/api/update_product/")
def update_product(id: Annotated[int, Form(..., description="The ID of the product")], 
    product_name: Annotated[str, Form(..., description="The name of the product")], 
    size: Annotated[str, Form(..., description="The size of the product")], 
    price: Annotated[str, Form(..., description="The price of the product")]
    , image: Annotated[UploadFile, File(...)]
    ,current_user: UserSchema = Depends(get_current_user)):
    product_model = Database()
    """code for delete product image from image folder and add updated image"""
    query='select image_path from products WHERE id=%s'
    params = (id,)
    product_data = product_model.database_operation((query,params))
    image_path = product_data.get("data")
    directory = image_path[0][0]
    prefix = directory.split('/')[0:2]
    prefix = str('/'.join(prefix))
    folder_path = os.path.join(STATIC_DIR, prefix)
    shutil.rmtree(folder_path)

    """ To Update the image and other field"""
    random_number = random.randint(1000, 9999)
    product_folder = "product" + str(random_number)
    image_folder = f"static/product_images/{product_folder}"
    
    os.makedirs(image_folder, exist_ok=True)
    
    # Generate unique name for the image
    image_name = str(uuid.uuid4()) + ".jpg"
    image_path = os.path.join(image_folder, image_name)
    
    # Save the uploaded file
    with open(image_path, "wb") as buffer:
        buffer.write(image.file.read())
        
    img_path = image_path.replace('static/', '', 1)
    query = 'UPDATE products SET product_name=%s, size=%s, price=%s, image_path=%s WHERE id=%s'
    params = (product_name, size, price, img_path, id)
    product_data = product_model.database_operation((query, params))
    
    if product_data.get("success"):
        return {"message": "Data successfully inserted"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error: No product was inserted"
        )


#Fast Api Authentication 
@router.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],) -> Token:
    user_model = Database()
    query = "SELECT * FROM user WHERE username = %s"
    params = (form_data.username,)
    user_data = user_model.database_operation((query, params))
    user = user_data.get("data")
    role = (user_data.get("data")[0][-1])
    print(user_data.get("data")[0][1],"****************************&&&")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    hashed_password_from_db = user_data.get("data")[0][4]
   
    if not verify_password(form_data.password, hashed_password_from_db):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        print("password verified")
   
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user_data.get("data")[0][1], expires_delta=access_token_expires)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_refresh_token(user_data.get("data")[0][1], expires_delta=refresh_token_expires)
    return Token(access_token=access_token, token_type="bearer", refresh_token=refresh_token,role=role)



#Access Token generating using refresh token
@router.post("/refresh-token")
def get_refresh_token(tokens: RefreshToken):
    refresh_token = tokens.refresh_token
    print(tokens,"****************refresh_token*****************",refresh_token)
    try:
        decoded_token = jwt.decode(refresh_token, JWT_REFRESH_SECRET_KEY,algorithms=['HS256'])
    except JWTError as e:
        return {"error":e}
    
    try:
        decoded_token = jwt.decode(refresh_token, JWT_REFRESH_SECRET_KEY,algorithms=['HS256'])
        print(decoded_token,"***********decoded_token************")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(decoded_token.get('sub'), expires_delta=access_token_expires)
        print(access_token,"@@@@@@@@@@@@@@access_token@@@@@@@@@@@@@")
        return {"message":True,"access_token":access_token}
    
    except JWTError as e:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Invalid refresh token"})
    

   

    

   