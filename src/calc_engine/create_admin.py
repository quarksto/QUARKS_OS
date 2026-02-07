import asyncio
import sys
import os

# Fix import path
sys.path.append(os.getcwd())

from src.prisma import prisma
from prisma.enums import Role
from src.utils.security import get_password_hash

async def main():
    await prisma.connect()
    
    email = "admin@quarks.com"
    password = "admin"
    hashed_password = get_password_hash(password)
    
    print(f"Creating/Updating user {email} with password '{password}'...")
    
    try:
        # Check if user exists
        user = await prisma.user.find_unique(where={"email": email})
        
        if user:
            print(f"User found (ID: {user.id}). Updating password...")
            updated_user = await prisma.user.update(
                where={"id": user.id},
                data={
                    "password": hashed_password,
                    "role": Role.ADMIN
                }
            )
            print(f"User updated successfully: {updated_user.email}")
        else:
            print("User not found. Creating new admin user...")
            new_user = await prisma.user.create(
                data={
                    "email": email,
                    "password": hashed_password,
                    "name": "Admin User",
                    "role": Role.ADMIN
                }
            )
            print(f"User created successfully: {new_user.email}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
