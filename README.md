# 📚 Course Feedback System

A full-stack web application for managing course feedback.  
Students can sign up, log in, submit feedback, and manage their profiles, while admins can oversee submissions and view analytics.

---

## 🚀 Features
- 🔐 User Authentication (Signup/Login with validation)  
- 👤 Profile Management  
- 📝 Feedback Submission & Management  
- 🛠️ Admin Dashboard  
- 📊 Analytics & Reports  
- ☁️ File Uploads via Cloudinary  
- 🗄️ MongoDB Integration  

---

## 🛠️ Tech Stack
- **Backend:** Django, Django REST Framework  
- **Database:** MongoDB (Atlas)  
- **Frontend:** HTML, CSS, JavaScript  
- **Media Storage:** Cloudinary  

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/course-feedback-system.git
cd course-feedback-system
2️⃣ Backend Setup (Django)
Navigate into the backend folder:

bash
Copy code
cd backend
Create a virtual environment:

bash
Copy code
python3 -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Create a .env file inside the backend/ directory with the following contents:

env
Copy code
DEBUG=False
SECRET_KEY=django-insecure-f97gx3wq)%s=af-0*=jx6*8x*2=8w%bwfer1-ev9b)8lf9ga$@
DB_URI=mongodb+srv://admin:password314159@feedback-system.mk5rxaj.mongodb.net/?retryWrites=true&w=majority&appName=feedback-system
CLOUDINARY_CLOUD_NAME=dl1j5hfhv
CLOUDINARY_API_KEY=441134613823658
CLOUDINARY_API_SECRET=7MtuE5EHJj_JBIpBqO9JaMy3kB0
⚠️ Replace values with your own if you are setting up from scratch:

SECRET_KEY → Generate using Django’s get_random_secret_key()

DB_URI → Create a free MongoDB Atlas cluster

Cloudinary → Get API keys from Cloudinary Dashboard

Run migrations & start the backend:

bash
Copy code
python manage.py migrate
python manage.py runserver
Backend runs at: http://127.0.0.1:8000

3️⃣ Frontend Setup
Navigate to the frontend folder:

bash
Copy code
cd ../frontend
Open index.html with Live Server (VS Code extension or similar).

Frontend runs at: http://127.0.0.1:5500 (default Live Server port)

🔑 Default Credentials
Admin
Email: admin@example.com

Password: Password123!

Sample User
Email: kalonji@gmail.com

Password: Kalonji#123

🧪 Testing Checklist
 Sign up a new user

 Log in with user credentials

 Submit feedback

 Edit/Delete feedback

 Log in as admin and view all feedback

 Upload profile picture (via Cloudinary)

 Check analytics in admin dashboard

📌 Notes
This project is for demonstration and learning purposes.

Do not commit real secrets to public repositories.

Replace the .env values with your own when deploying.

