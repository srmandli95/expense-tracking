import streamlit as st
from add_expense_ui import add_expense_tab
from analytics_ui import analytics_tab
from get_expense_ui import get_expense_tab
from delete_expense_ui import delete_expense_tab
from authentication import login  # Import authentication module

# Check if user is authenticated
if "authenticated" not in st.session_state:
    st.session_state["authenticated"] = False

if not st.session_state["authenticated"]:
    login()
else:
    st.title("Expense Management System")

    # Logout button
    if st.sidebar.button("🚪 Logout"):
        st.session_state["authenticated"] = False
        st.session_state["username"] = None
        st.experimental_rerun()

    # Create Tabs
    tab1, tab2, tab3, tab4 = st.tabs(["Add Expense", "Get Expense", "Delete Expense", "Analytics"])

    with tab1:
        add_expense_tab()
        
    with tab2:
        get_expense_tab()

    with tab3:
        delete_expense_tab()

    with tab4:
        analytics_tab()
