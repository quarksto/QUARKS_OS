import asyncio
from src.prisma import prisma
from prisma.enums import Role
from src.utils.security import get_password_hash
from prisma import Json
import uuid

async def main():
    await prisma.connect()
    try:
        email = f"copilot-debug-{uuid.uuid4()}@quarks.os"
        
        # Create User
        user = await prisma.user.create(
            data={
                "email": email,
                "password": "hashed",
                "name": "Debug Copilot User",
                "role": Role.INTEGRADOR
            }
        )
        print(f"User created: {user.id}")
        
        # Test Session Creation with Json wrapper
        print("Attempting to create session with Json({})...")
        try:
            session = await prisma.agentsession.create(
                data={
                    "userId": user.id,
                    "context": Json({})
                }
            )
            print(f"Success with Json wrapper! Session ID: {session.id}")
            
        except Exception as e:
            print(f"Failed with Json wrapper: {e}")
            import traceback
            traceback.print_exc()

    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
