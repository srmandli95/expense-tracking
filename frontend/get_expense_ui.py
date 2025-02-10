import streamlit as st
from datetime import datetime, date
import requests
import pandas as pd

BASE_URL = "http://localhost:8000"

def get_expense_tab():
    col1, col2 = st.columns(2)
    with col1:
        start_date = st.date_input("Select Start Date", value=date.today())

    with col2:
        end_date = st.date_input("Select End Date", value=date.today())

    if st.button("🧾 Get Expenses"):
        # Make API request to FastAPI
        response = requests.get(f"{BASE_URL}/getexpenses/{start_date}/{end_date}")

        if response.status_code == 200:
            expenses = response.json()

            if expenses:  # Check if response is not empty
                df = pd.DataFrame(expenses).reset_index(drop=True)
                st.write("### Expense Data")
                st.table(df)
            else:
                st.warning("No expenses found for the selected date range.") 

        else:
            st.error("Failed to fetch expenses. Please check API.")