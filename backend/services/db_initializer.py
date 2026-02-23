from services.db_service import get_connection


def initialize_database():

    conn = get_connection()
    cursor = conn.cursor()

    print("Checking database tables...")

    cursor.execute("""
    IF NOT EXISTS (
        SELECT * FROM sysobjects
        WHERE name='Conversations' AND xtype='U'
    )
    CREATE TABLE dbo.Conversations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_email VARCHAR(255),
        created_at DATETIME DEFAULT GETDATE()
    )
    """)

    cursor.execute("""
    IF NOT EXISTS (
        SELECT * FROM sysobjects
        WHERE name='Messages' AND xtype='U'
    )
    CREATE TABLE dbo.Messages (
        id INT IDENTITY(1,1) PRIMARY KEY,
        conversation_id INT,
        sender_type VARCHAR(10),
        message NVARCHAR(MAX),
        collection_used VARCHAR(100),
        created_at DATETIME DEFAULT GETDATE()
    )
    """)

    cursor.execute("""
    IF NOT EXISTS (
        SELECT * FROM sysobjects
        WHERE name='MessageSources' AND xtype='U'
    )
    CREATE TABLE dbo.MessageSources (
        id INT IDENTITY(1,1) PRIMARY KEY,
        message_id INT,
        file_name VARCHAR(500),
        page_number VARCHAR(50),
        full_path VARCHAR(1000)
    )
    """)

    cursor.execute("""
IF NOT EXISTS (
    SELECT * FROM sysobjects
    WHERE name='Reactions' AND xtype='U'
)
CREATE TABLE dbo.Reactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    message_id BIGINT,
    user_email VARCHAR(255),
    reaction NVARCHAR(20),
    created_at DATETIME DEFAULT GETDATE()
)
""")

    conn.commit()
    conn.close()

    print("Database ready ")
