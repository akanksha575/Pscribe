import sys
from cryptography.fernet import Fernet, InvalidToken

def main():
    print("=== Fernet Encryption/Decryption Demonstration ===")
    
    # 1. Ask the user to enter a password or text
    try:
        user_input = input("Enter password/text: ")
        if not user_input:
            print("Error: Input cannot be empty.")
            return
    except EOFError:
        # Handles cases where input is piped or automated
        user_input = sys.stdin.readline().strip()
        print(f"Enter password/text: {user_input}")

    try:
        # 2. Generate a new symmetric encryption key
        # Fernet.generate_key() creates a URL-safe base64-encoded 32-byte key.
        # This key must be kept secret. Anyone with this key can decrypt the data.
        key = Fernet.generate_key()
        
        # Initialize the Fernet cipher suite with the generated key
        cipher = Fernet(key)

        # 3. Encrypt the entered text
        # The input string must be encoded to bytes (UTF-8) before encryption.
        encrypted_bytes = cipher.encrypt(user_input.encode('utf-8'))
        
        # 4. Decrypt the encrypted text
        # The cipher returns bytes, so we decode it back to a UTF-8 string.
        decrypted_bytes = cipher.decrypt(encrypted_bytes)
        decrypted_text = decrypted_bytes.decode('utf-8')

        # 5. Print the required outputs clearly
        print("\n--- Results ---")
        print(f"Original Input: {user_input}")
        
        # Decode the key to string for display purposes
        print(f"Generated Key:  {key.decode('utf-8')}")
        
        # Decode the encrypted bytes to string for display purposes
        print(f"Encrypted Text: {encrypted_bytes.decode('utf-8')}")
        
        print(f"Decrypted Text: {decrypted_text}")

    except InvalidToken:
        print("\nError: Decryption failed. The token is invalid or the key is incorrect.")
    except Exception as e:
        print(f"\nAn unexpected error occurred during encryption/decryption: {str(e)}")

if __name__ == "__main__":
    main()
