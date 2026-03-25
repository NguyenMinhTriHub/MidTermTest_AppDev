from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_all_photos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Photo).offset(skip).limit(limit).all()

def get_photo(db: Session, photo_id: int, user_id: int = None):
    if user_id:
        return db.query(models.Photo).filter(models.Photo.id == photo_id, models.Photo.user_id == user_id).first()
    else:
        return db.query(models.Photo).filter(models.Photo.id == photo_id).first()

def create_photo(db: Session, photo: schemas.PhotoCreate, image_url: str, user_id: int):
    db_photo = models.Photo(**photo.dict(), image_url=image_url, user_id=user_id)
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

def update_photo(db: Session, photo_id: int, photo: schemas.PhotoCreate, user_id: int = None):
    query = db.query(models.Photo).filter(models.Photo.id == photo_id)
    if user_id:
        query = query.filter(models.Photo.user_id == user_id)
    db_photo = query.first()
    if db_photo:
        for key, value in photo.dict().items():
            setattr(db_photo, key, value)
        db.commit()
        db.refresh(db_photo)
    return db_photo

def delete_photo(db: Session, photo_id: int, user_id: int = None):
    query = db.query(models.Photo).filter(models.Photo.id == photo_id)
    if user_id:
        query = query.filter(models.Photo.user_id == user_id)
    db_photo = query.first()
    if db_photo:
        db.delete(db_photo)
        db.commit()
    return db_photo

def search_all_photos(db: Session, query: str):
    return db.query(models.Photo).filter(models.Photo.title.contains(query)).all()