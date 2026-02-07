from src.services.proposal_generator import ProposalGenerator
from src.services.visual import VisualService
from src.models.proposal import ProposalData
# Import any other needed services

from google.genai import types

TOOLS = [
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="create_proposal_preview",
                description="Generates a comprehensive solar proposal preview based on customer consumption and location.",
                parameters={
                    "type": "OBJECT",
                    "properties": {
                        "name": { "type": "STRING", "description": "Customer name" },
                        "consumption": { "type": "NUMBER", "description": "Monthly average consumption in kWh (e.g. 500)" },
                        "distributor": { "type": "STRING", "enum": ["CPFL_PAULISTA", "ENEL_SP", "CEMIG"], "description": "Energy distributor name" },
                        "zipCode": { "type": "STRING", "description": "CEP format 00000-000" },
                        "city": { "type": "STRING" },
                        "state": { "type": "STRING", "description": "UF (XY)" }
                    },
                    "required": ["consumption", "distributor"]
                }
            )
        ]
    ),
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="generate_image",
                description="Generates a photorealistic image based on a description.",
                parameters={
                    "type": "OBJECT",
                    "properties": {
                        "prompt": { "type": "STRING", "description": "Detailed visual description of the image to generate" }
                    },
                    "required": ["prompt"]
                }
            )
        ]
    ),
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="generate_video",
                description="Generates a short video (Veo) based on a description.",
                parameters={
                    "type": "OBJECT",
                    "properties": {
                        "prompt": { "type": "STRING", "description": "Detailed description of the video movement and content" }
                    },
                    "required": ["prompt"]
                }
            )
        ]
    )
]

async def execute_tool(name: str, args: dict):
    print(f"[Copilot Tools] Executing {name} with {args}")
    
    if name == "create_proposal_preview":
        # Map args to ProposalData
        # Note: ProposalGenerator expects specific Pydantic models. 
        # We need to construct them or use a helper. 
        # For now, simplistic mapping assuming ProposalData structure:
        # { customer: {...}, consumption: ..., distributor: ... }
        
        # ProposalData expects nested objects.
        data = ProposalData(
            customer={
                "name": args.get("name", "Cliente"),
                "zip": args.get("zipCode", "13000-000"),
                "city": args.get("city", "Campinas"),
                "state": args.get("state", "SP"),
                "consumption_avg": float(args.get("consumption", 0))
            },
            distributor=args.get("distributor", "CPFL_PAULISTA"),
            kit_id=None # Generator picks default
        )
        
        result = ProposalGenerator.generate(data)
        
        # Convert to simplified dict for LLM
        return {
            "systemSize": result.system_size_kwp,
            "totalPrice": result.total_price,
            "monthlySavings": result.monthly_savings,
            "payback": result.payback_years,
            "previewUrl": f"http://localhost:5173/proposta/{result.id}"
        }

    elif name == "generate_image":
        return await VisualService.generate_image(args.get("prompt"))

    elif name == "generate_video":
        return await VisualService.generate_video(args.get("prompt"))

    else:
        return {"error": f"Tool {name} not found"}
