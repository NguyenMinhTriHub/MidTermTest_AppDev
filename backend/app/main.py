from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
import bcrypt, hashlib, os, shutil
from datetime import datetime

# Cấu hình thư mục lưu trữ file
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Kết nối Database SQLite [cite: 45]
SQLALCHEMY_DATABASE_URL = "sqlite:///./gallery.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model Người dùng [cite: 47-51]
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# Model Ảnh [cite: 52-58]
class Photo(Base):
    __tablename__ = "photos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    image_url = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# Bảo mật mật khẩu
def get_password_hash(password: str):
    pwd_hash = hashlib.sha256(password.encode()).hexdigest()
    return bcrypt.hashpw(pwd_hash.encode(), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    pwd_hash = hashlib.sha256(plain_password.encode()).hexdigest()
    return bcrypt.checkpw(pwd_hash.encode(), hashed_password.encode())

# API Đăng ký [cite: 35]
@app.post("/register")
def register(user: dict, db: Session = Depends(get_db)):
    new_user = User(
        username=user['username'], 
        email=user['email'], 
        hashed_password=get_password_hash(user['password'])
    )
    db.add(new_user); db.commit()
    return {"message": "Thành công"}

# API Đăng nhập [cite: 35]
@app.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user['username']).first()
    if not db_user or not verify_password(user['password'], db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Sai thông tin")
    return {"username": db_user.username}

# API Upload ảnh [cite: 36]
@app.post("/upload")
async def upload_file(
    title: str = Form(...), 
    description: str = Form(None), 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    file_name = f"{datetime.now().timestamp()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    image_url = f"http://localhost:8000/static/uploads/{file_name}"
    new_photo = Photo(title=title, description=description, image_url=image_url)
    db.add(new_photo); db.commit()
    return {"image_url": image_url}

# API Danh sách ảnh [cite: 37]
@app.get("/photos")
def get_photos(db: Session = Depends(get_db)):
    return db.query(Photo).all()

# API Xóa ảnh [cite: 39]
@app.delete("/photos/{id}")
def delete_photo(id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == id).first()
    if photo:
        db.delete(photo); db.commit()
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Không thấy ảnh")