import mysql.connector
from contextlib import contextmanager
from backend.logging_setup import setup_logger


logger = setup_logger('db_helper')

@contextmanager
def get_db_cursor(commit=False):
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="expense_manager"
    )

    cursor = connection.cursor(dictionary=True)
    yield cursor

    if commit:
        connection.commit()
    cursor.close()
    connection.close()

def fetch_expense_for_date(start_date, end_date):
    logger.info(f"fetch_expense_for_date called with {start_date} and {end_date}")

    with get_db_cursor() as cursor:
        query = "SELECT * FROM expenses WHERE expense_date BETWEEN %s AND %s"
        cursor.execute(query, (start_date, end_date))  # Safe SQL execution
        expenses = cursor.fetchall()

    return expenses  # Return the fetched results


def delete_expense_by_id(expense_id):
    logger.info(f"delete_expense_by_id called with ID: {expense_id}")

    with get_db_cursor(commit=True) as cursor:
        cursor.execute("DELETE FROM expenses WHERE id = %s", (expense_id,))
        return cursor.rowcount > 0  # Returns True if a row was deleted

        

def insert_expense(expense_date, amount, category, notes):
    logger.info(f"insert_expense called with date: {expense_date}, amount: {amount}, category: {category}, notes: {notes}")
    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO expenses (expense_date, amount, category, notes) VALUES (%s, %s, %s, %s)",
            (expense_date, amount, category, notes)
        )


def fetch_expenses_by_month(month):
    logger.info(f"Fetching expenses for month: {month}")

    with get_db_cursor() as cursor:
        query = """
        SELECT category, SUM(amount) as total
        FROM expenses
        WHERE DATE_FORMAT(expense_date, '%Y-%m') = %s
        GROUP BY category
        """
        cursor.execute(query, (month,))
        expenses = cursor.fetchall()

    # Convert to dictionary and calculate percentages
    total_spent = sum(exp["total"] for exp in expenses)
    result = {
        exp["category"]: {
            "total": exp["total"],
            "percentage": (exp["total"] / total_spent * 100) if total_spent > 0 else 0
        }
        for exp in expenses
    }

    return result



if __name__ == '__main__':


    expenses = fetch_expense_summary("2024-09-05", "2024-09-05")
    for expense in expenses:
        print(expense)
    

