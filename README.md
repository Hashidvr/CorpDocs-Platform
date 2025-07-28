# CorpDocs-Platform
# CorpDocs-Platform
# 📘 CorpDocs – A Collaborative Knowledge Base Platform

CorpDocs is a full-stack web application that serves as a modern, lightweight alternative to Confluence. Designed for team collaboration, CorpDocs enables users to create, manage, share, and search rich-text documents with built-in user mentions, access control, and version history.

This project was built as part of an assignment for the Associate Software Engineer position at **Frigga Cloud Labs**.

---

## 🌐 Live Demo

> 💡 https://drive.google.com/file/d/1nZK-_kEfhNSn4cHT2nROtUKqI9xNr9Xy/view?usp=sharing 

---

## 🔧 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Tailwind CSS, React Quill, React Router DOM |
| Backend   | Django, Django REST Framework, JWT Auth |
| Database  | SQLite (for development)          |
| Auth      | JWT (via `rest_framework_simplejwt`) |
| Email     | Gmail SMTP (for password reset & mentions) |
| Dev Tool  | Vite                              |

---

## ✨ Features Overview

### 🔐 Authentication
- User registration with email and password
- Secure JWT-based login system
- Forgot password and reset via email
- Protected routes and token management

### 📝 Document Management
- Rich WYSIWYG Editor for document creation and editing
- Auto-save with debounce for seamless updates
- Toggle between public/private visibility
- Document search by title/content with highlighting

### 👥 Collaboration
- Mention users with `@email` to notify and share documents
- Email alerts for mentions with direct document links
- Access-based document rendering

### 🧠 Version History
- Tracks all changes automatically
- Displays edit history with editor and timestamp
- Option to browse past versions

### 📂 Document Views
- Public link for anonymous viewing
- Private access restricted to author or shared users
- Dashboard for all created and shared docs
- Mentions page for docs where user is tagged

---

## 📁 Project Structure

### Backend (`/backend`)
- `accounts/`: Custom user model, registration, login, password reset
- `documents/`: Document models, version tracking, mention system
- `settings.py`: Configured for CORS, JWT, SMTP, and custom auth

### Frontend (`/frontend`)
- `pages/`: All routes – login, register, dashboard, editor, etc.
- `components/`: Shared UI – navbar, footer, hero, features, etc.
- `utils/`: LocalStorage token management, fetch helpers
- `Editor.jsx`: Rich editor with mention detection & public toggle

---

## 🚀 Getting Started

### 🖥 Backend Setup

```bash
# Clone the repository
git clone https://github.com/Hashidvr/CorpDocs-Platform
cd CorpDocs-Platform

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

📧 **Email Setup**  
Add the following to `.env` or directly in `settings.py` for email sending:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com  // from which gmail if you want to sent email means 
EMAIL_HOST_PASSWORD=your_app_password  // AppPassword created using google, not:-dont you orginal password
```

---

### 🌐 Frontend Setup

```bash
cd ../frontend

# Install frontend packages
npm install

# Start development server
npm run dev
```

Access the app at: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Credentials

```
Email: random@gmail.com
Password: random0011

or

register with new credentials
```

---

## 📌 Assignment Requirements Checklist

| Feature                                 | Status |
|----------------------------------------|--------|
| User Authentication (JWT)              | ✅     |
| Forgot Password via Email              | ✅     |
| Rich Text Document Editor              | ✅     |
| Global Search (Title + Content)        | ✅     |
| Mention Users via `@email`             | ✅     |
| Auto Sharing on Mention                | ✅     |
| Public & Private Access Toggle         | ✅     |
| View Shared Docs                       | ✅     |
| Version History                        | ✅     |
| Clean UI/UX                            | ✅     |
| Responsive & Mobile Friendly           | ✅     |

---

## 🧪 Testing Instructions

> You may use `Postman` or frontend UI for testing APIs.

API Base URL: `http://localhost:8000/api/`

- Register: `POST /auth/register/`
- Login: `POST /auth/login/`
- Create Document: `POST /documents/`
- View Docs: `GET /documents/`
- Public Doc View: `GET /documents/public-documents/<id>/`
- Version History: `GET /documents/<id>/versions/`

---

## 🧠 Learnings & Highlights

- Custom user model with email login
- Seamless React-Django integration with CORS
- Handling mentions as access control triggers
- Debounced auto-save with optimistic update
- Reusable toast notifications for user feedback
- Secure password reset flow via email token links

---

## 👤 Author

**Mohamed Hashid**  
📧 [mohammedhashid10@gmail.com](mailto:mohammedhashid10@gmail.com)  
🔗 [GitHub](https://github.com/Hashidvr)  
🔗 [LinkedIn](https://www.linkedin.com/in/mohamed-hashed-6b820b2a6/)

---

## 📄 License

This project is intended for educational/demo purposes. Production use should involve proper environment security, database optimization, testing, and deployment setup.

---
