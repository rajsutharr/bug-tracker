🐞 Full-Stack Bug Tracker Kanban
A professional, real-time issue management tool built with FastAPI and React. This project features a dynamic Kanban board with drag-and-drop persistence, live search, and full CRUD (Create, Read, Update, Delete) capabilities.

🚀 Key Features
Interactive Kanban: Seamlessly drag cards between "To Do", "In Progress", and "Done" columns.

Real-time Search: Instant filtering of issues by title or description as you type.

Persistent Backend: A robust Python API that saves all changes to a local SQLite database.

Modern UI: Clean, responsive interface with a blurred-glass modal system for editing bugs.

🛠️ Tech Stack
Frontend: React.js, Vite, @dnd-kit (Drag and Drop), Axios.

Backend: FastAPI (Python), SQLAlchemy (ORM), Pydantic.

Database: SQLite.

Styling: Modern CSS3 with custom variables and glassmorphism.

🏁 How to Run Locally
1. Backend Setup
Bash
cd app
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install fastapi uvicorn sqlalchemy
uvicorn main:app --reload
2. Frontend Setup
Bash
cd frontend
npm install
npm run dev
