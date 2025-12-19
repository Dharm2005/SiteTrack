# 🚧 SiteTrack – Construction Site Management System

SiteTrack is a **full-stack MERN web application** designed to simplify and digitize construction site operations. It helps **Admins and Managers** efficiently manage sites, workers, expenses, and reports with secure authentication and insightful visualizations.

---

## 📌 Features

### 🔐 Authentication & Authorization
- JWT-based authentication for secure login
- Role-based access control (**Admin & Manager**)

### 👤 Admin Module
- Register and manage Managers
- Create and manage construction sites
- Assign managers to sites
- View overall reports and site records
- Recycle bin support (restore or permanently delete data)

### 👷 Manager Module
- Manage assigned sites
- Add and manage workers
- Track worker advances, earnings, and final settlements
- Manage site expenses with filters and search
- Add notes and reminders
- Mark sites as completed and review past records

### 💰 Expense & Analytics
- Expense tracking with date-based filters
- Monthly expense visualization using **Recharts**
- Search and categorized expense records

### 📄 Reports
- Generate detailed **PDF reports** using **PDFKit**
- Expense and site-wise reporting

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Recharts (for charts & analytics)

### Backend
- Node.js
- Express.js
- JWT Authentication
- PDFKit (PDF generation)

### Database
- MongoDB

### Tools
- Git & GitHub
- VS Code

---

## 📂 Project Structure

```
SiteTrack/
│
├── front_end/        # React frontend
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       └── services/   
├── back_end/         # Node.js & Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── utils/
├── .env.example
├── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js
- MongoDB (local or MongoDB Atlas)

### Clone the repository
```bash
git clone https://github.com/Dharm2005/Construction-Management-System.git
cd CONSTRUCTION MANAGEMENT SYSTEM
```

### Backend Setup
```bash
cd baack_end
npm install
```
Create a `.env` file using `.env.example` and add required variables.

```bash
npm start
```

### Frontend Setup
```bash
cd fornt_end
npm install
npm start
```

---

## 📸 Screenshots
- Login Page
- Admin Dashboard
- Managers & Sites Management
- Workers & Expenses
- Reports & Charts


---

## 🚀 Future Improvements
- Notification system
- Advanced analytics dashboard
- Role-based permissions at feature level
- Mobile responsiveness improvements

---

## 👨‍💻 Author
**Dharm Dobariya**  
Aspiring MERN Stack Developer

- GitHub: https://github.com/Dharm2005
- LinkedIn: https://www.linkedin.com/in/dharm-dobariya-42408134b/

---

## ⭐ Acknowledgements
This project was built as a hands-on learning experience to apply MERN stack concepts in a real-world scenario.

Feel free to ⭐ this repository if you find it useful!