from services.db_service import get_connection


def get_user_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, email FROM Users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()

    conn.close()
    return user


def create_user(email: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO Users (email)
        OUTPUT INSERTED.id
        VALUES (?)
        """,
        (email,)
    )

    result = cursor.fetchone()
    conn.commit()
    conn.close()

    return result[0] if result else None
