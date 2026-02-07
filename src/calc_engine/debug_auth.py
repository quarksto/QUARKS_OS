import asyncio
from src.prisma import prisma
from prisma.enums import Role
from src.utils.security import get_password_hash

async def main():
    await prisma.connect()
    try:
        email = f"debug-{get_password_hash('x')[:5]}@quarks.os"
        print(f"Creating user {email}...")
        
        # Test Role enum
        print(f"Role.INTEGRADOR type: {type(Role.INTEGRADOR)}")
        print(f"Role.INTEGRADOR value: {Role.INTEGRADOR}")

        user = await prisma.user.create(
            data={
                "email": email,
                "password": "hashed",
                "name": "Debug User",
                "role": Role.INTEGRADOR
            }
        )
        print(f"User created: {user.id}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
