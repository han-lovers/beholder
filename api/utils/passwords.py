import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(password.encode("utf-8"), salt)

    return hash

def validate_password(hash, password):
    if bcrypt.checkpw(password.encode("utf-8"), hash):
        return True
    
    return False