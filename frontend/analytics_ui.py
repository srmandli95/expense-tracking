import streamlit as st
import requests
import pandas as pd
from datetime import datetime

API_URL = "http://localhost:8000"

def analytics_tab():

    # Select Month and Year
    col1, col2 = st.columns(2)
    with col1:
        selected_year = st.selectbox("Select Year", list(range(2020, datetime.today().year + 1)), index=4)
    with col2:
        selected_month = st.selectbox("Select Month", 
                                      ["January", "February", "March", "April", "May", "June", 
                                       "July", "August", "September", "October", "November", "December"],
                                      index=datetime.today().month - 1)

    # Convert month to numeric format
    month_number = list(range(1, 13))[["January", "February", "March", "April", "May", "June", 
                                        "July", "August", "September", "October", "November", "December"].index(selected_month)]
    selected_month_str = f"{selected_year}-{month_number:02d}"  # Format as YYYY-MM

    # Fetch Monthly Expenses
    if st.button("📊 Get Monthly Analytics"):
        payload = {"month": selected_month_str}
        response = requests.post(f"{API_URL}/analytics/monthly/", json=payload)

        if response.status_code == 200:
            response_data = response.json()

            # Extract Categories and Expenses
            categories = list(response_data.keys())
            total_spent = [round(response_data[category]["total"], 2) for category in categories]
            percentages = [round(response_data[category]["percentage"], 2) for category in categories]


            # Create DataFrame
            df = pd.DataFrame({
                "Category": categories,
                "Total Spent": total_spent,
                "Percentage": percentages
            })

            df_sorted = df.sort_values(by="Total Spent", ascending=False)

            # Display Table
            st.subheader(f"💰 Expense Breakdown for {selected_month}")
            st.table(df_sorted)

            # Bar Chart for Category-wise Expense Distribution
            st.subheader(f"Expense Distribution - {selected_month}")
            st.bar_chart(df_sorted.set_index("Category")["Total Spent"], use_container_width=True)

        else:
            st.error("Failed to fetch analytics data. Please check the API.")
