import requests, json, sys

BASE_URL = "http://localhost:8000"

def health_check():
    r = requests.get(f"{BASE_URL}/api/health")
    r.raise_for_status()
    print("Health check OK:", r.json())

def create_patient():
    payload = {
        "first_name": "Auto",
        "last_name": "Tester",
        "dob": "1985-05-05",
        "sex": "F",
        "account_no": "AUTO123"
    }
    r = requests.post(f"{BASE_URL}/api/patients/", json=payload)
    r.raise_for_status()
    data = r.json()
    print("Created patient:", data)
    return data["id"]

def list_patients():
    r = requests.get(f"{BASE_URL}/api/patients/")
    r.raise_for_status()
    print("Patient list:", r.json())

def main():
    try:
        health_check()
        pid = create_patient()
        list_patients()
        print("All tests passed.")
    except Exception as e:
        print("Test failed:", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
