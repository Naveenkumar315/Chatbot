import pyodbc
from dotenv import load_dotenv
import os

load_dotenv()


def get_connection():

    connection_string = (
        f"DRIVER={{ODBC Driver 18 for SQL Server}};"
        f"SERVER={os.getenv('DB_SERVER')};"
        f"DATABASE={os.getenv('DB_NAME')};"
        f"UID={os.getenv('DB_USER')};"
        f"PWD={os.getenv('DB_PASSWORD')};"
        f"TrustServerCertificate=yes;"
    )

    return pyodbc.connect(connection_string)


def get_db():
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()


if __name__ == "__main__":
    try:
        conn = get_connection()
        print("SQL Connection successful!")
        conn.close()
    except Exception as e:
        print("SQL Connection failed!")
        print(e)
