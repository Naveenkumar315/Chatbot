
import pyodbc


def get_or_create_conversation(conn, email):

    cursor = conn.cursor()

    cursor.execute("""
        SELECT TOP 1 id
        FROM Conversations
        WHERE user_email = ?
        ORDER BY created_at DESC
    """, (email,))

    row = cursor.fetchone()

    if row:
        return row[0]

    cursor.execute("""
        INSERT INTO Conversations(user_email)
        OUTPUT INSERTED.id
        VALUES(?)
    """, (email,))

    return cursor.fetchone()[0]


def save_message(conn, conversation_id, sender, message, collection=None):

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Messages
        (conversation_id, sender_type, message, collection_used)
        OUTPUT INSERTED.id
        VALUES (?, ?, ?, ?)
    """, (
        conversation_id,
        sender,
        message,
        collection
    ))

    return cursor.fetchone()[0]


def save_sources(conn, message_id, sources):

    cursor = conn.cursor()

    for src in sources:
        cursor.execute("""
            INSERT INTO MessageSources
            (message_id, file_name, page_number, full_path)
            VALUES (?, ?, ?, ?)
        """, (
            message_id,
            src["file"],
            src["page"],
            src["fullpath"]
        ))


def save_reaction(conn, message_id, user_email, reaction, action):
    cursor = conn.cursor()

    cursor.setinputsizes([(pyodbc.SQL_WVARCHAR, 50, 0)])

    if action == "remove":
        cursor.execute("""
            DELETE FROM dbo.Reactions
            WHERE message_id = ? AND user_email = ?
        """, (message_id, user_email))
        return

    cursor.execute("""
        SELECT id FROM dbo.Reactions
        WHERE message_id = ? AND user_email = ?
    """, (message_id, user_email))

    row = cursor.fetchone()

    if row:
        cursor.execute("""
            UPDATE dbo.Reactions
            SET reaction = ?, created_at = GETDATE()
            WHERE message_id = ? AND user_email = ?
        """, (reaction, message_id, user_email))
    else:
        cursor.execute("""
            INSERT INTO dbo.Reactions (message_id, user_email, reaction)
            VALUES (?, ?, ?)
        """, (message_id, user_email, reaction))
