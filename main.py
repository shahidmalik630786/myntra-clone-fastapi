from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from routers import ecom
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from operations import user_login,Database
from jose import ExpiredSignatureError
from fastapi.responses import JSONResponse



app = FastAPI()

app.include_router(ecom.router)

app.mount('/static', StaticFiles(directory="static"),name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request,role: str = "user"):
    return templates.TemplateResponse("home.html", {"request": request, "products": "Home page"})

