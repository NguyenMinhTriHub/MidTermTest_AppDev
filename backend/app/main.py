from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, create_engine, or_
from sqlalchemy.orm import sessionmaker, Session, declarative_base
import bcrypt
import hashlib
import re

# 1. Database & Models
SQLALCHEMY_DATABASE_URL = "sqlite:///./gallery.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Photo(Base):
    __tablename__ = "photos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    url = Column(String)

Base.metadata.create_all(bind=engine)

# 2. Helpers (Logic xử lý mật khẩu đồng bộ)
def get_password_hash(password: str):
    pwd_hash = hashlib.sha256(password.encode()).hexdigest()
    return bcrypt.hashpw(pwd_hash.encode(), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    pwd_hash = hashlib.sha256(plain_password.encode()).hexdigest()
    return bcrypt.checkpw(pwd_hash.encode(), hashed_password.encode())

# 3. FastAPI Config
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# 4. Endpoints
@app.post("/register")
def register(user: dict, db: Session = Depends(get_db)):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", user.get('email', '')):
        raise HTTPException(status_code=400, detail="Email không hợp lệ")
    if db.query(User).filter(or_(User.username == user['username'], User.email == user['email'])).first():
        raise HTTPException(status_code=400, detail="User hoặc Email đã tồn tại")
    
    db_user = User(
        username=user['username'], 
        email=user['email'], 
        hashed_password=get_password_hash(user['password'])
    )
    db.add(db_user); db.commit()
    return {"message": "Thành công"}

@app.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.get('username')).first()
    if not db_user or not verify_password(user.get('password', ''), db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Sai tài khoản hoặc mật khẩu")
    return {"username": db_user.username}

@app.get("/photos")
def get_photos(db: Session = Depends(get_db)):
    return db.query(Photo).all()

@app.post("/upload")
def upload(data: dict, db: Session = Depends(get_db)):
    db.add(Photo(title=data['title'], url=data['url'])); db.commit()
    return {"message": "OK"}

@app.delete("/photos/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == id).first()
    if photo: db.delete(photo); db.commit()
    return {"message": "Deleted"}