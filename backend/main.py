from fastapi import FastAPI
from getBalance import router as get_balance_router

app = FastAPI()
app.include_router(get_balance_router, prefix="/api", tags=["users"])


@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}