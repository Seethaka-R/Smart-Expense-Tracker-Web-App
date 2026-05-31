# Smart Expense Tracker Web App

A full-stack personal finance web application for tracking income, expenses, transactions, monthly budgets, and spending analytics.

## Problem Statement

Managing daily expenses manually can become confusing, especially when income, spending categories, savings, and monthly budget limits are tracked in different places. Users need a simple dashboard where they can record transactions, review spending patterns, and understand whether they are staying within budget.

## Solution

Smart Expense Tracker provides a secure full-stack web app where users can register, log in, add income or expense transactions, filter transaction history, view analytics charts, and set monthly budget limits. The frontend is built with React and Tailwind CSS, while the backend uses Express, MongoDB, JWT authentication, and Mongoose models.

## Features

- User registration and login
- JWT-based protected API routes
- Add, edit, delete, search, and filter transactions
- Track income and expenses by category
- Dashboard summary for total income, total expenses, and net savings
- Spending charts using Recharts
- Monthly budget creation and budget status alerts
- Responsive dark-themed UI

## Tech Tools Used

**Frontend**

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Lucide React Icons

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- dotenv
- cors
- nodemon

## Project Directory Structure

```text
Smart-Expense-Tracker-Web-App/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BudgetStatus.jsx
│   │   │   ├── DashboardCharts.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Budget.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── transactionRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Project Execution Steps

### 1. Clone or Open the Project

```bash
cd Smart-Expense-Tracker-Web-App
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend Environment

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-expense-tracker
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Use a local MongoDB connection or replace `MONGO_URI` with your MongoDB Atlas connection string.

### 4. Start the Backend Server

```bash
cd server
npm run dev
```

Backend server runs on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open a new terminal.

```bash
cd client
npm install
```

### 6. Start the Frontend App

```bash
cd client
npm run dev
```

Frontend app runs on:

```text
http://localhost:3000
```

The Vite development server proxies `/api` requests to the backend at `http://localhost:5000`.

## API Routes

### Auth Routes

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Transaction Routes

```text
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/transactions/summary
```

### Budget Routes

```text
GET  /api/budgets
POST /api/budgets
GET  /api/budgets/status/:month
```

## Required Outputs

After running the project successfully, the application should provide:

- Login and registration screens
- Protected dashboard after authentication
- Income, expense, and savings summary cards
- Transaction add/edit/delete functionality
- Transaction search and filters
- Spending by category chart
- Monthly spending trend chart
- Monthly budget status and alert messages

## Screenshots

Add your screenshots inside a `docs/screenshots/` folder and update the paths below.

### Login Page

```md
![Login Page](docs/screenshots/login.png)
```

### Register Page

```md
![Register Page](docs/screenshots/register.png)
```

### Dashboard

```md
![Dashboard](docs/screenshots/dashboard.png)
```

### Transaction Management

```md
![Transaction Management](docs/screenshots/transactions.png)
```

### Budget Status

```md
![Budget Status](docs/screenshots/budget-status.png)
```

## Future Improvements

- Add password reset functionality
- Add email verification
- Add recurring transactions
- Add CSV or PDF export
- Add advanced reports by week, month, and year
- Add multi-currency support
- Add profile management
- Add light and dark theme toggle
- Add automated tests for frontend and backend
- Deploy frontend and backend to production hosting platforms

## Author

**Name:** Seethaka Rakshitha
**Email:** seethakarakshitha901@Gmail.com 
**GitHub:** https://github.com/Seethaka-R  
**LinkedIn:** https://linkedin.com/in/seethaka-Rakshitha

## License

This project is created for learning and academic/project demonstration purposes.
