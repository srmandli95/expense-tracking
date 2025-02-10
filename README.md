# 💰 Expense Tracker

A **full-stack Expense Tracker** built using **Streamlit (Frontend)**, **FastAPI (Backend)**, and **MySQL (Database)**.  
It allows users to **add, view, analyze, and delete expenses**, offering a seamless experience for expense tracking.

---

## 📜 Project Structure
expense-tracker/
│── backend/                # Backend (FastAPI)
│   ├── __init__.py
│   ├── db_helper.py        # Database operations
│   ├── server.py           # FastAPI server
│   ├── logging_setup.py    # Logging configuration

│── frontend/               # Frontend (Streamlit)
│   ├── __init__.py
│   ├── app.py              # Main Streamlit app
│   ├── authentication.py   # User authentication
│   ├── add_expense_ui.py   # UI for adding expenses
│   ├── get_expense_ui.py   # UI for viewing expenses
│   ├── delete_expense_ui.py# UI for deleting expenses
│   ├── analytics_ui.py     # UI for expense analytics
                   
│── README.md               # Project documentation
│── Pipfile / Pipfile.lock  # Pipenv dependency management

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies:
This project uses Pipenv for dependency management. If Pipenv is not already installed, you can install it and then set up the project dependencies by running the following c

```bash
pip install pipenv
pipenv install
```

**###3. Run the webservers: **

```bash
pipenv run streamlit run frontend/app.py
pipenv run uvicorn backend.server:app --host 0.0.0.0 --port 8000 --reload
```
