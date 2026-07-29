# VisionEdge

## Project Overview

VisionEdge is a hardware-accelerated video pipeline backend developed using FastAPI. The project is designed to provide a scalable and modular API architecture for edge-based computer vision applications. It follows a clean project structure with REST APIs, database integration, and versioned endpoints.

---

## Features

- FastAPI REST Backend
- API Versioning
- Swagger API Documentation
- Health Check API
- User Management CRUD APIs
- SQLite Database Integration
- SQLAlchemy ORM
- Global Exception Handling
- Logging Support
- Modular Project Structure

---

## Technology Stack

- Python 3.9+
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn
- Pydantic
- React + Vite (Frontend)

---

## Project Structure

```
VisionEdge/
│
├── backend/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   └── main.py
│
├── frontend/
├── docs/
├── reports/
├── tests/
├── requirements.txt
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Create virtual environment

```bash
python3 -m venv venv
```

Activate environment

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
uvicorn backend.main:app --reload
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Welcome API |
| GET | /api/v1/health | Health Check |
| POST | /api/v1/users | Create User |
| GET | /api/v1/users | Get All Users |
| GET | /api/v1/users/{id} | Get User By ID |
| PUT | /api/v1/users/{id} | Update User |
| DELETE | /api/v1/users/{id} | Delete User |

---

## Database

SQLite database is used for development with SQLAlchemy ORM.

---

## Future Scope

- JWT Authentication
- User Login
- Video Stream Processing
- Object Detection Integration
- NVIDIA DeepStream Support
- TensorRT Optimization

---

## Team

VisionEdge Internship Project

---

## License

This project is developed for learning and internship purposes.
