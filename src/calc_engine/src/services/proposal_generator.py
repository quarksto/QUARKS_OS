import os
from jinja2 import Environment, FileSystemLoader
from ..models.proposal import ProposalData, ProposalResponse

class ProposalGenerator:
    _template_env = None

    @classmethod
    def _get_env(cls):
        if cls._template_env is None:
            # Assumes templates are in src/calc_engine/templates
            template_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'templates')
            cls._template_env = Environment(loader=FileSystemLoader(template_dir))
        return cls._template_env

    @staticmethod
    def generate(data: ProposalData) -> ProposalResponse:
        env = ProposalGenerator._get_env()
        template = env.get_template('proposal_modern.html')
        
        # Render HTML
        html_content = template.render(data=data)
        
        # Generate ID (Mock)
        prop_id = f"PROP-{data.customer.city[:3].upper()}-{len(data.customer.name)}"
        
        return ProposalResponse(
            html_content=html_content,
            proposal_id=prop_id,
            status="GENERATED"
        )
