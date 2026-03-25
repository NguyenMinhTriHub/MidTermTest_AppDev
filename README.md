# Gallery App - Personal Photo Library

A full-stack web application for managing personal photos with user authentication.

## Features

- User registration and login (Google Photos-style interface)
- Upload photos with title and description
- View photo gallery
- Click on photos to view details
- Edit photo title and description
- Delete photos
- Search photos by title
- Responsive design

## Tech Stack

- **Backend**: FastAPI, SQLite, SQLAlchemy
- **Frontend**: React.js, Axios
- **Authentication**: JWT tokens

## Project Structure

```
gallery-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── auth.py
│   │   └── database.py
│   ├── uploads/
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── UploadPhoto.js
    │   │   └── PhotoCard.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Gallery.js
    │   │   └── PhotoDetail.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

The app will be available at `http://localhost:3000`

## API Endpoints

- `POST /register` - User registration
- `POST /token` - User login
- `POST /photos/` - Upload photo
- `GET /photos/` - Get all photos for user
- `GET /photos/{photo_id}` - Get specific photo
- `PUT /photos/{photo_id}` - Update photo
- `DELETE /photos/{photo_id}` - Delete photo
- `GET /photos/search/?query={query}` - Search photos

## Usage

1. Register a new account or login with existing credentials
2. Upload photos using the upload form
3. Browse your photo gallery
4. Click on photos to view details
5. Edit or delete photos as needed
6. Use the search bar to find specific photos

## Security Notes

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- CORS is configured to allow requests from the React frontend
- File uploads are stored in the `backend/uploads/` directory

## Development

- The backend uses SQLite for simplicity (can be changed to PostgreSQL/MySQL for production)
- Images are stored locally (consider cloud storage like AWS S3 for production)
- The frontend uses React hooks for state management
- All buttons have proper onClick handlers
- Loading states and error handling are implemented