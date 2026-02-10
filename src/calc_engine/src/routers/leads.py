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
    
    # Fetch all leads with proposals for revenue calc
    all_leads = await prisma.lead.find_many(
        order={"createdAt": "desc"},
        include={
            "owner": True,
            "proposals": True
        }
    )
    
    # Initialize pipeline with empty lists
    statuses = ["NEW", "CONTACTED", "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]
    pipeline = {status: [] for status in statuses}
    
    # Metrics counters
    active_leads_count = 0
    proposals_count = 0
    revenue = 0.0
    won_count = 0
    lost_count = 0
    
    # Distribute leads into buckets and calc metrics
    for lead in all_leads:
        status = lead.status
        
        # Add to pipeline
        if status in pipeline:
            lead_dict = lead.dict()
            if lead.owner:
                 lead_dict['ownerName'] = lead.owner.name
            pipeline[status].append(lead_dict)

        # Metrics Logic
        if status in ["NEW", "CONTACTED", "PROPOSAL_SENT", "NEGOTIATION"]:
            active_leads_count += 1
        
        if status == "CLOSED_WON":
            won_count += 1
        if status == "CLOSED_LOST":
            lost_count += 1
            
        # Count proposals (any lead with at least one proposal?) 
        # Or count total proposals sent?
        # Let's count total proposals that are not DRAFT
        if lead.proposals:
            for p in lead.proposals:
                if p.status != "DRAFT":
                    proposals_count += 1
                if p.status == "ACCEPTED":
                    revenue += p.totalPrice

    # Conversion Rate (Won / (Won + Lost) or Won / Total?)
    # Usually Won / Total Closed or similar. Let's use Won / (Won + Lost) for closed conversion
    # OR Won / Total Leads. Let's stick to simple Won / Total for now? 
    # Let's do Won / (Won + Lost) if > 0, else 0.
    closed_total = won_count + lost_count
    conversion_rate = 0.0
    if closed_total > 0:
        conversion_rate = (won_count / closed_total) * 100
        
    # Funnel Counts
    funnel_counts = {
        "leads": active_leads_count, # Total active
        "visita": len(pipeline.get("CONTACTED", [])), # Contacted -> Visita (approx mapping)
        "proposta": len(pipeline.get("PROPOSAL_SENT", [])),
        "contrato": len(pipeline.get("NEGOTIATION", [])), # Negotiation -> Contrato (approx)
        "instalacao": won_count # Won -> Instalacao
    }
    
    # Recent Activity (Last 5 updated leads)
    # in a real app, we'd query AuditLog. Here, use leads sorted by updatedAt
    recent_leads = sorted(all_leads, key=lambda x: x.updatedAt, reverse=True)[:5]
    activity_feed = []
    
    for l in recent_leads:
        # Simple heuristic for activity text
        action_text = f"Lead {l.name} atualizado"
        if l.status == "NEW": action_text = f"Novo lead: {l.name}"
        elif l.status == "PROPOSAL_SENT": action_text = f"Proposta enviada para {l.name}"
        elif l.status == "CLOSED_WON": action_text = f"Venda fechada: {l.name}"
        
        # Calculate relative time string (simple logic)
        # For now, just passing the timestamp, frontend can format?
        # Or simplistic "recentemente"
        
        activity_feed.append({
            "id": l.id,
            "text": action_text,
            "timestamp": l.updatedAt.isoformat(),
            "type": l.status # for dot color mapping
        })

    pipeline["metrics"] = {
        "activeLeads": active_leads_count,
        "proposalsSent": proposals_count,
        "conversionRate": f"{conversion_rate:.1f}%",
        "revenue": revenue
    }
    
    pipeline["funnel"] = funnel_counts
    pipeline["activity"] = activity_feed
            
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
