import asyncio
import sys
import os

# Fix import path
sys.path.append(os.getcwd())

from src.prisma import prisma
from prisma.enums import LeadStatus, Role

async def main():
    await prisma.connect()
    
    # Create User if not exists
    user = await prisma.user.find_first(where={"email": "admin@quarks.com"})
    if not user:
        user = await prisma.user.create(
            data={
                "email": "admin@quarks.com",
                "password": "hashed_secret", # Mock
                "name": "Admin User",
                "role": Role.ADMIN
            }
        )
        print("Created Admin User")
    
    # Create Leads
    leads_data = [
        {"name": "Padaria do João", "consumption": 1200.0, "status": LeadStatus.NEW, "distributor": "ENEL_SP"},
        {"name": "Residência Silva", "consumption": 450.0, "status": LeadStatus.CONTACTED, "distributor": "CPFL_PAULISTA"},
        {"name": "Mercado Central", "consumption": 3500.0, "status": LeadStatus.PROPOSAL_SENT, "distributor": "CEMIG"},
        {"name": "Sítio Boa Vista", "consumption": 800.0, "status": LeadStatus.NEGOTIATION, "distributor": "ELEKTRO"},
        {"name": "Indústria Tech", "consumption": 15000.0, "status": LeadStatus.CLOSED_WON, "distributor": "ENEL_SP"},
    ]
    
    for lead in leads_data:
        exists = await prisma.lead.find_first(where={"name": lead["name"]})
        if not exists:
            await prisma.lead.create(
                data={
                    "name": lead["name"],
                    "consumption": lead["consumption"],
                    "status": lead["status"],
                    "distributor": lead["distributor"],
                    "ownerId": user.id
                }
            )
            print(f"Created Lead: {lead['name']}")
    
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
