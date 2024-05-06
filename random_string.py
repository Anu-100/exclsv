import string
import random

def generate_secret_key():
    chars = string.digits + string.ascii_lowercase + string.ascii_uppercase
    return ''.join(random.choice(chars) for _ in range(50))

print(generate_secret_key())