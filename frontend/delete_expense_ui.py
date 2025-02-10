import streamlit as st
import requests

API_URL = "http://localhost:8000"

def delete_expense_tab():

    expense_id = st.number_input("Enter Expense ID to Delete", min_value=1, step=1)

    if st.button("🗑️ Delete Expense"):
        if expense_id:
            response = requests.delete(f"{API_URL}/deleteexpense/{expense_id}")

            if response.status_code == 200:
                st.success(response.json()["message"])
            elif response.status_code == 404:
                st.error("Expense not found. Please check the ID.")
            else:
                st.error("Failed to delete expense. Try again.")
        else:
            st.warning("Please enter a valid Expense ID.")