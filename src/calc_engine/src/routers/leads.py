from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from src.prisma import prisma
from src.routers.auth import get_current_user

router = APIRouter(prefix="/leads", tags=["Leads"])

class LeadCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    consumption: float
    distributor: Optional[str] = None
    ownerId: Optional[str] = None

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    consumption: Optional[float] = None
    
@router.get("/pipeline")
async def get_pipeline_summary(user=Depends(get_current_user)):
    # Group by status
    # Prisma doesn't support groupBy cleanly in early python client versions for all db types exactly like JS
    # But usually it does. Let's do a simple count query or fetch all for now and aggregate if needed, 
    # OR use explicit group_by if available.
    # For POC, let's fetch counts per status.
    
    # Fetch all leads
    all_leads = await prisma.lead.find_many(
        order={"createdAt": "desc"},
        include={"owner": True} # Include owner details for avatar
    )
    
    # Initialize pipeline with empty lists
    statuses = ["NEW", "CONTACTED", "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]
    pipeline = {status: [] for status in statuses}
    
    # Distribute leads into buckets
    for lead in all_leads:
        status = lead.status
        if status in pipeline:
            # Convert to dict and add extra fields if needed for UI (like formatted values)
            lead_dict = lead.dict()
            # Ensure dates are strings if needed, though Pydantic handles this mostly.
            # UI expects specific fields, let's map them if needed or just pass full object
            
            # Map 'owner' name if available
            if lead.owner:
                 lead_dict['ownerName'] = lead.owner.name
            
            pipeline[status].append(lead_dict)
            
    return pipeline

@router.get("/", response_model=List[dict]) # Return list of leads
async def get_leads(user=Depends(get_current_user)):
    leads = await prisma.lead.find_many(order={"createdAt": "desc"})
    return [lead.dict() for lead in leads]

@router.post("/")
async def create_lead(lead: LeadCreate, user=Depends(get_current_user)):
    # Default owner to first user found if not provided or current user
    # For now, simplistic
    
    # Check owner
    owner_id = lead.ownerId
    if not owner_id:
        # Pick first user or use fixed one for migration
        first_user = await prisma.user.find_first()
        if first_user:
            owner_id = first_user.id
        else:
            # Fallback (shouldn't happen if seeded)
            raise HTTPException(status_code=400, detail="No users exist to own lead")
            
    new_lead = await prisma.lead.create(
        data={
            "name": lead.name,
            "consumption": lead.consumption,
            "phone": lead.phone,
            "email": lead.email,
            "distributor": lead.distributor,
            "ownerId": owner_id,
            "status": "NEW"
        }
    )
    return new_lead.dict()

@router.put("/{id}")
async def update_lead(id: str, updates: LeadUpdate, user=Depends(get_current_user)):
    data = {}
    if updates.status:
        data["status"] = updates.status
    if updates.consumption:
        data["consumption"] = updates.consumption
        
    updated = await prisma.lead.update(
        where={"id": id},
        data=data
    )
    return updated.dict()
