import streamlit as st
from datetime import datetime, date
import requests

API_URL = "http://localhost:8000"

def add_expense_tab():
  

    selected_date = st.date_input("Enter Date", date.today(), label_visibility="collapsed")
    categories = ["Rent", "Food", "Shopping", "Entertainment", "Other"]

    # Initialize session state for tracking row count
    if "num_rows" not in st.session_state:
        st.session_state.num_rows = 3  # Start with 3 rows

    expenses = []  # Store user inputs

    with st.form(key="expense_form"):
        col1, col2, col3 = st.columns(3)
        with col1:
            st.text("Amount")
        with col2:
            st.text("Category")
        with col3:
            st.text("Notes")

        for i in range(st.session_state.num_rows):
            col1, col2, col3 = st.columns(3)

            with col1:
                amount = st.number_input(label="Amount", min_value=0.0, step=1.0, value=0.0, key=f"amount_{i}", label_visibility="collapsed")

            with col2:
                category = st.selectbox(label="Category", options=categories, key=f"category_{i}", label_visibility="collapsed")

            with col3:
                notes = st.text_input(label="Notes", key=f"notes_{i}", label_visibility="collapsed")

            # Add user inputs to list
            expenses.append({"expense_date": str(selected_date), "amount": amount, "category": category, "notes": notes})

        # Add button to increase the number of rows
        if st.form_submit_button("➕ Add More Rows"):
            st.session_state.num_rows += 1

        submit_button = st.form_submit_button("✅ Submit Expenses")
        
        if submit_button:
            # Remove empty rows (amount = 0.0)
            expenses = [exp for exp in expenses if exp["amount"] > 0]

            if not expenses:
                st.warning("No expenses entered.")
                return

            response = requests.post(f"{API_URL}/addexpense/", json=expenses)

            if response.status_code == 200:
                st.success("Expenses submitted successfully!")
                # Reset form and row count after submission
                st.session_state.num_rows = 3
            else:
                st.error("Failed to submit expenses.")