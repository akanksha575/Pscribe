from cryptography.fernet import Fernet

# The key you generated and stored in .env
key = b"Q_z95N4TYfkO9IJU56u4mHv0WmB29_g7vVfLDh0eQcQ="
cipher = Fernet(key)

# The password to encrypt
password = "jP@$rB%6s86FY7b"

# Encrypting the password
encrypted_password = cipher.encrypt(password.encode())

print("Encrypted Password:")
print(encrypted_password.decode())

print("Congrats! Good Job")