import streamlit as st

# Simulated user credentials (Replace with DB check in future)
USER_CREDENTIALS = {
    "admin": "password123",
    "srikar": "securepass"
}

def login():
    """Login page for authentication."""
    st.title("🔐 Login to Expense Tracker")

    username = st.text_input("Username", key="username")
    password = st.text_input("Password", type="password", key="password")

    if st.button("Login"):
        if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
            st.session_state["authenticated"] = True
            st.session_state["username"] = username
            st.success(f"✅ Welcome, {username}!")
            st.experimental_rerun()  # Refresh app after login
        else:
            st.error("❌ Incorrect Username or Password")
