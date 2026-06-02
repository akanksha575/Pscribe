import os
import csv
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_service_role_key:
    print("Error: Supabase URL or Service Role Key is missing.")
    exit(1)

# Create Supabase Admin client
supabase_admin = create_client(supabase_url, supabase_service_role_key)

csv_path = r"c:\Users\91707\Downloads\users_20.csv"

def import_users():
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return

    success_count = 0
    error_count = 0

    with open(csv_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            email = row.get('email')
            password = row.get('password')
            full_name = row.get('full_name')
            role = row.get('role')
            phone = row.get('phone')

            if not email or not password:
                continue

            try:
                # Create user in Supabase Auth
                response = supabase_admin.auth.admin.create_user({
                    "email": email,
                    "password": password,
                    "email_confirm": True,
                    "user_metadata": {
                        "full_name": full_name,
                        "role": role,
                        "phone": phone
                    }
                })
                print(f"Successfully created user: {email}")
                success_count += 1
            except Exception as e:
                error_msg = str(e)
                if "already been registered" in error_msg or "already exists" in error_msg:
                    print(f"User already exists: {email}")
                else:
                    print(f"Failed to create user {email}: {error_msg}")
                    error_count += 1

    print(f"\nImport complete! Successfully imported {success_count} users. Errors: {error_count}")

if __name__ == "__main__":
    import_users()
