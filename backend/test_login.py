import requests
resp = requests.post('http://127.0.0.1:8000/api/auth/login', data={'username':'test@example.com','password':'secret'})
print('Status:', resp.status_code)
print('Body:', resp.text)
