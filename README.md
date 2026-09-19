# Day 7 - Task Tracker

A simple full-stack Task Tracker built for internship Day 7.

## Features
- Add a task
- View all tasks
- Update a task
- Delete a task
- Change task status
- JSON REST API
- SQLite database
- Responsive frontend

## Technologies
- HTML
- CSS
- JavaScript
- Python
- Django
- SQLite

## Run Backend

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install packages:

```bash
pip install -r requirements.txt
```

Create database:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start server:

```bash
python manage.py runserver
```

Backend API:

`http://127.0.0.1:8000/api/tasks/`

## Run Frontend

Open `frontend/index.html` in a browser after starting Django.

## API Endpoints

GET `/api/tasks/` - list tasks  
POST `/api/tasks/` - create task  
GET `/api/tasks/<id>/` - get one task  
PUT `/api/tasks/<id>/` - update task  
DELETE `/api/tasks/<id>/` - delete task
