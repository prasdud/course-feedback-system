Course Feedback System
A comprehensive course feedback management system built with Django (backend) and HTML/CSS/JavaScript (frontend).
🚀 Features

User authentication and authorization
Course feedback submission and management
Admin dashboard for feedback monitoring
Responsive web interface
Cloud-based file storage with Cloudinary
MongoDB database integration

📋 Prerequisites
Before you begin, ensure you have the following installed:

Python 3.8 or higher
Node.js (for live server)
Git

🛠️ Installation & Setup
1. Clone the Repository
bashgit clone <your-repository-url>
cd course-feedback-project
2. Backend Setup
Navigate to the backend directory:
bashcd backend/
Create and activate a virtual environment:
bash# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
Install required dependencies:
bashpip install -r requirements.txt
3. Environment Configuration
Create a .env file in the backend directory with the following configuration:
envDEBUG=False
SECRET_KEY=django-insecure-f97gx3wq)%s=af-0*=jx6*8x*2=8w%bwfer1-ev9b)8lf9ga$@
DB_URI=mongodb+srv://admin:password314159@feedback-system.mk5rxaj.mongodb.net/?retryWrites=true&w=majority&appName=feedback-system
CLOUDINARY_CLOUD_NAME=dl1j5hfhv
CLOUDINARY_API_KEY=441134613823658
CLOUDINARY_API_SECRET=7MtuE5EHJj_JBIpBqO9JaMy3kB0
4. Setting Up External Services
MongoDB Atlas

Create a free account at MongoDB Atlas
Create a new cluster
Set up database user credentials
Get your connection string and update DB_URI in the .env file

Cloudinary

Create a free account at Cloudinary
Navigate to your dashboard to find:

Cloud Name
API Key
API Secret


Update the corresponding values in the .env file

5. Run Database Migrations
bashpython manage.py makemigrations
python manage.py migrate
6. Start the Backend Server
bashpython manage.py runserver
The backend will be available at http://127.0.0.1:8000/
7. Frontend Setup
Open a new terminal and navigate to the frontend directory:
bashcd frontend/
Start the frontend using a live server:

If using VS Code: Right-click on index.html and select "Open with Live Server"
If using Python: python -m http.server 8080
If using Node.js: Install live-server globally and run live-server

The frontend will typically be available at http://127.0.0.1:5500/ or http://localhost:8080/
👤 Default User Accounts
Admin Account

Email: admin@example.com
Password: Password123!

Sample User Account

Email: kalonji@gmail.com
Password: Kalonji#123

🖥️ Usage

Start both backend and frontend servers following the installation steps
Access the frontend interface through your browser
Login using the provided credentials
Admin users can access the dashboard to manage feedback
Regular users can submit and view their feedback

📁 Project Structure
course-feedback-project/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env (create this file)
│   └── [Django project files]
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── [Frontend assets]
└── README.md
🔧 Development
Backend Development

The Django backend handles API endpoints, user authentication, and database operations
Models are configured to work with MongoDB
Static files and media uploads are handled through Cloudinary

Frontend Development

Pure HTML/CSS/JavaScript frontend
Responsive design for mobile and desktop
Communicates with backend through REST API calls

🐛 Troubleshooting
Common Issues

Virtual environment not activating:

Ensure you're in the correct directory
Check if Python is properly installed


Database connection errors:

Verify MongoDB Atlas connection string
Check if your IP is whitelisted in MongoDB Atlas


Cloudinary upload issues:

Verify API credentials
Check internet connectivity


Frontend not loading:

Ensure live server is running
Check browser console for errors



📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🤝 Contributing

Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Open a Pull Request

📞 Support
If you encounter any issues or have questions, please open an issue in the GitHub repository.