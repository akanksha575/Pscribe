import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import urllib.parse

load_dotenv()

# API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ---------------------------------------------------------
# DATABASE SECURITY IMPLEMENTATION
# ---------------------------------------------------------
# To prevent hardcoding sensitive database passwords in plaintext (which is a security risk),
# we utilize symmetric encryption using the Fernet algorithm from the `cryptography` library.
# Fernet guarantees that a message encrypted using it cannot be manipulated or read without the key.

# 1. Retrieve the encryption key and the ciphertext (encrypted password) from environment variables.
encryption_key = os.getenv("ENCRYPTION_KEY")
encrypted_password = os.getenv("DB_PASSWORD_ENCRYPTED")

if encryption_key and encrypted_password:
    # 2. Initialize the Fernet cipher suite using our secret key.
    cipher = Fernet(encryption_key.encode())
    
    # 3. Decrypt the ciphertext to obtain the plaintext password. 
    # We decode from bytes back to a standard UTF-8 string.
    db_password = cipher.decrypt(encrypted_password.encode()).decode()
    
    # 4. URL-encode the password.
    # Database passwords often contain special characters (like @, #, $, %).
    # If placed directly into a connection URL, they can break the URI parsing. 
    # urllib.parse.quote_plus safely encodes these characters (e.g., '@' becomes '%40').
    encoded_password = urllib.parse.quote_plus(db_password)
    
    # 5. Dynamically construct the SQLAlchemy connection string.
    DATABASE_URL = (
        f"postgresql://postgres:{encoded_password}"
        "@db.qadbdfryabxjuboizmds.supabase.co:5432/postgres"
    )
else:
    # Fallback to standard environment variables if encryption is not configured.
    DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("SQLALCHEMY_DATABASE_URL")

PATIENT_DATA_DIR = os.getenv(
    "PATIENT_DATA_DIR",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "patient_data")
)

os.makedirs(PATIENT_DATA_DIR, exist_ok=True)