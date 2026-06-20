# 📚 Offline Knowledge Capsule

> **Learn anytime, anywhere — even without internet**

A full-stack Progressive Web App (PWA) that delivers structured educational content across 6 learning capsules with complete offline support, quizzes, bookmarks, and progress tracking.

🌐 **Live Demo**: [offline-knowledge-capsule-woad.vercel.app](https://offline-knowledge-capsule-woad.vercel.app)  
🔧 **Backend API**: [offline-knowledge-capsule.onrender.com/api](https://offline-knowledge-capsule.onrender.com/api/categories/)  
📄 **Best Paper Award** – AITSDT-2026 National Conference

---

## ✨ Features

- 📖 **90 Articles** across 6 learning capsules
- 🧠 **18 Quizzes** with 90 MCQ questions and explanations
- 🔐 **JWT Authentication** — Register, Login, secure sessions
- 🔖 **Bookmark System** — Save articles for later
- 📊 **Progress Dashboard** — Track articles read and quiz scores
- 🔍 **Smart Search** — Search across titles, content, tags and categories
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📱 **Mobile Responsive** — Works on all screen sizes
- 💾 **100% Offline Support** — IndexedDB caches all 90 articles and 18 quizzes
- ⚙️ **Service Worker** — PWA installable as a native app
- 🛠️ **Django Admin Panel** — Add/edit articles and quizzes easily

---

## 🗂️ Learning Capsules

| Capsule | Color | Articles | Quizzes |
|---------|-------|----------|---------|
| 🧠 General Knowledge | Blue | 15 | 3 |
| 💚 Health and Security | Green | 15 | 3 |
| 💼 Career and Skills | Purple | 15 | 3 |
| ⭐ Fun and Creativity | Orange | 15 | 3 |
| 🏛️ Government and Welfare | Red | 15 | 3 |
| 🔬 Science and Technology | Cyan | 15 | 3 |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI Framework |
| React Router DOM | Client-side routing |
| Axios | API communication |
| React Icons | Icon library |
| IndexedDB (idb) | Offline data storage |
| Service Worker | PWA & caching |
| CSS Variables | Theming & dark mode |

### Backend
| Technology | Purpose |
|------------|---------|
| Django 5.x | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | JWT Authentication |
| django-cors-headers | CORS handling |
| WhiteNoise | Static file serving |
| SQLite | Database |
| Gunicorn | Production server |

### Deployment
| Service | Purpose |
|---------|---------|
| Render | Backend hosting (free) |
| Vercel | Frontend hosting (free) |
| GitHub | Version control & CI/CD |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/rdeekshitha184-ship-it/Offline-Knowledge-Capsule.git
cd Offline-Knowledge-Capsule
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Load sample data (90 articles + 18 quizzes)
python manage.py loaddata capsules/fixtures/sample_data.json

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`  
Admin panel at: `http://127.0.0.1:8000/admin`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | ❌ |
| POST | `/api/auth/login/` | Login & get JWT token | ❌ |
| GET | `/api/auth/profile/` | Get user profile | ✅ |
| GET | `/api/categories/` | List all 6 capsules | ❌ |
| GET | `/api/articles/` | List articles (filter/search) | ❌ |
| GET | `/api/articles/<id>/` | Single article | ❌ |
| GET | `/api/articles/<id>/related/` | Related articles | ❌ |
| GET | `/api/quizzes/` | List quizzes | ❌ |
| GET | `/api/quizzes/<id>/` | Quiz with questions | ❌ |
| GET | `/api/bookmarks/` | User bookmarks | ✅ |
| POST | `/api/bookmarks/toggle/<id>/` | Add/remove bookmark | ✅ |
| GET | `/api/progress/` | User progress summary | ✅ |
| POST | `/api/progress/read/<id>/` | Mark article as read | ✅ |
| POST | `/api/progress/quiz/` | Submit quiz score | ✅ |

---

## 📁 Project Structure

```
Offline-Knowledge-Capsule/
│
├── backend/
│   ├── core/                  # Django project settings
│   │   ├── settings.py
│   │   ├── production_settings.py
│   │   └── urls.py
│   ├── users/                 # Authentication app
│   ├── capsules/              # Articles & categories app
│   │   └── fixtures/
│   │       └── sample_data.json   # 90 articles + 18 quizzes
│   ├── quizzes/               # Quiz & questions app
│   ├── bookmarks/             # Bookmark app
│   ├── progress/              # Progress tracking app
│   ├── requirements.txt
│   ├── Procfile
│   └── manage.py
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   ├── manifest.json      # PWA manifest
    │   └── service-worker.js  # Offline caching
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── OfflineBanner.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── CapsuleDetail.js
    │   │   ├── ArticlePage.js
    │   │   ├── QuizPage.js
    │   │   ├── Dashboard.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── ArticlesSearch.js
    │   │   └── NotFound.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   └── utils/
    │       ├── api.js         # Axios API calls
    │       ├── offlineDB.js   # IndexedDB operations
    │       └── syncData.js    # Offline sync logic
    ├── package.json
    └── vercel.json
```

---

## 💾 Offline Support

The app supports **complete offline functionality** after initial sync:

1. **Visit the app** while online
2. **Click "Save for Offline"** in the banner
3. All 90 articles and 18 quizzes are saved to **IndexedDB**
4. **Turn off internet** — everything still works!

### How it works:
```
Online  → API call → Cache in IndexedDB
Offline → IndexedDB → Display cached content
Search  → Offline full-text search across all articles
```

### What works offline:
| Feature | Status |
|---------|--------|
| Home page & capsules | ✅ |
| All 90 articles | ✅ |
| All 18 quizzes | ✅ |
| Article search | ✅ |
| Dark mode | ✅ |
| Login / Bookmarks | ❌ Needs internet |

---

## 🗄️ Database Models

```
Category          Article              Quiz
---------         --------             ----
id                id                   id
name              title                category (FK)
description       content              title
icon              summary              description
color             category (FK)
order             tags                 Question
                  reading_time         --------
Bookmark          is_featured          id
--------          created_at           quiz (FK)
id                                     question_text
user (FK)         ArticleProgress      option_a/b/c/d
article (FK)      ---------------      correct_answer
created_at        user (FK)            explanation
                  article (FK)
                  read_at              QuizScore
                                       ---------
                                       user (FK)
                                       quiz (FK)
                                       score
                                       total
                                       taken_at
```

---

## 🌐 Deployment

### Backend (Render)
1. Connect GitHub repo to Render
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt && python manage.py migrate && python manage.py loaddata capsules/fixtures/sample_data.json`
4. Start command: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`
5. Set environment variables:
   - `SECRET_KEY`
   - `DJANGO_SETTINGS_MODULE=core.production_settings`
   - `FRONTEND_URL=https://your-vercel-url.vercel.app`

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL=https://your-render-url.onrender.com/api`

---

## 👩‍💻 Author

**Deekshitha R**  
B.E. Computer Science | R R Institute of Technology, Bengaluru  
CGPA: 9.21 / 10

[![GitHub](https://img.shields.io/badge/GitHub-rdeekshitha184--ship--it-black?logo=github)](https://github.com/rdeekshitha184-ship-it)
[![HackerRank](https://img.shields.io/badge/HackerRank-rdeekshitha184-green?logo=hackerrank)](https://www.hackerrank.com/profile/rdeekshitha184)

---

## 🏆 Achievements

- 🥇 **Best Paper Award** – AITSDT-2026 National Conference
- 🎯 **Top 20 Finalist** – Build for Bengaluru Hackathon (120+ teams)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you found this helpful, please give it a star!**
