from fastapi import APIRouter, Depends
from src.prisma import prisma
from src.routers.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
async def get_dashboard_metrics(user=Depends(get_current_user)):
    # 1. Active Leads (Not closed)
    active_leads = await prisma.lead.count(
        where={
            "status": {
                "in": ["NEW", "CONTACTED", "PROPOSAL_SENT", "NEGOTIATION"]
            }
        }
    )
    
    # 2. Proposals Sent
    proposals_sent = await prisma.proposal.count(
        where={
            "status": "SENT"
        }
    )
    
    # 3. Conversion Rate
    # Rate = (CLOSED_WON / Total Leads) * 100
    total_leads = await prisma.lead.count()
    won_leads = await prisma.lead.count(where={"status": "CLOSED_WON"})
    
    conversion_rate = 0.0
    if total_leads > 0:
        conversion_rate = (won_leads / total_leads) * 100
        
    # 4. Revenue (Sum of won proposals)
    # We can sum the totalPrice of proposals that are ACCEPTED 
    # OR sum value of leads that are WON (if we stored value on lead).
    # Since Proposal has totalPrice, let's use ACCEPTED proposals.
    accepted_proposals = await prisma.proposal.find_many(
        where={"status": "ACCEPTED"}
    )
    revenue = sum([p.totalPrice for p in accepted_proposals])
    
    # Format revenue as BRL currency string is what frontend expects?
    # Frontend: "revenue: 'R$ 0,00'"
    # Let's return raw numbers if possible, but frontend code seems to expect formatted string or just displays it.
    # Looking at frontend code: setMetrics(kpisRes.data).
    # It might simply display what's returned. Let's return a formatted string to match the default state example.
    
    revenue_formatted = f"R$ {revenue:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    
    return {
        "activeLeads": active_leads,
        "proposalsSent": proposals_sent,
        "conversionRate": f"{conversion_rate:.1f}%",
        "revenue": revenue_formatted,
        "automations": "0" # Mock for now
    }

@router.get("/activity")
async def get_recent_activity(user=Depends(get_current_user)):
    # Fetch recent audit logs or mock
    # For now, let's return some mock activity if DB is empty, or query AuditLog
    
    # Real query
    logs = await prisma.auditlog.find_many(
        take=5,
        order={"createdAt": "desc"},
        include={"user": True}
    )
    
    activity_list = []
    for log in logs:
        activity_list.append({
            "id": log.id,
            "title": log.action,                   # Title = Action
            "type": "system",                      # Default to system
            "date": log.createdAt.isoformat(),     # Date
            "description": f"{log.user.name if log.user else 'Unknown'} - {log.resource}",
            "status": "INFO"
        })
        
    # If empty, return mock to look good for demo
    if not activity_list:
        return [
            {
                "id": "1", 
                "title": "Sistema Iniciado", 
                "type": "system", 
                "date": "2023-10-27T10:00:00.000Z", # Mock date
                "description": "Sistema Quarks OS iniciado com sucesso via Python Backend",
                "status": "INFO"
            },
        ]
        
    return activity_list

@router.get("/funnel")
async def get_funnel_data(user=Depends(get_current_user)):
    # Funnel: NEW -> CONTACTED -> PROPOSAL_SENT -> NEGOTIATION -> CLOSED_WON
    ids = ["NEW", "CONTACTED", "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON"]
    labels = ["Novos Leads", "Contactados", "Proposta Enviada", "Negociação", "Fechados"]
    colors = ["#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#10B981"]
    
    data = []
    for idx, status in enumerate(ids):
        count = await prisma.lead.count(where={"status": status})
        data.append({
            "id": status,
            "label": labels[idx],
            "value": count,
            "color": colors[idx]
        })
        
    return data
