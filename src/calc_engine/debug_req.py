import requests
import json

payload = {
  "customer": { "name": "João", "city": "Campinas", "state": "SP" },
  "generation": { "system_size_kwp": 5.0, "estimated_generation_monthly": 600, "panels_count": 10, "area_required_m2": 20 },
  "financials": {
    "monthly_savings_year1": 500,
    "payback_years": 4.5,
    "total_savings_25y": 150000,
    "roi_percentage": 200,
    "vpl": 50000,
    "irr": 0.05
  },
  "tariff": {
    "distributor": "DEFAULT",
    "total_rate_with_taxes": 0.92,
    "monthly_bill_estimated": 80,
    "components": { "te": 0.4, "tusd": 0.4, "icms_rate": 0.18, "pis_cofins_rate": 0.09 }
  },
  "kit_name": "Kit Test",
  "integrator_name": "Quarks"
}

try:
    r = requests.post("http://127.0.0.1:8000/generate/proposal", json=payload)
    print(f"Status: {r.status_code}")
    print(r.text)
except Exception as e:
    print(e)
