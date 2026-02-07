import requests
import json

def test_generation():
    url = "http://localhost:8000/calculate/generation"
    payload = {
        "consumption": {
            "monthly_avg": 500
        },
        "locality": {
            "latitude": -23.55,
            "longitude": -46.63,
            "city": "São Paulo",
            "state": "SP"
        }
    }
    
    try:
        print(f"Testing {url}...")
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("✅ Generation Success!")
        print(json.dumps(response.json(), indent=2))
        return response.json()
    except Exception as e:
        print(f"❌ Generation Failed: {e}")
        return None

def test_roi(system_cost, monthly_savings):
    url = "http://localhost:8000/calculate/roi"
    payload = {
        "system_cost": system_cost,
        "monthly_savings": monthly_savings,
        "tariff": 0.95
    }
    
    try:
        print(f"\nTesting {url}...")
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("✅ ROI Success!")
        print(json.dumps(response.json(), indent=2))
        return response.json()
    except Exception as e:
        print(f"❌ ROI Failed: {e}")
        return None

def test_tariff(consumption):
    url = "http://localhost:8000/calculate/tariff"
    payload = {
        "distributor": "ENEL_SP",
        "consumption_kwh": consumption,
        "voltage_group": "B"
    }
    
    try:
        print(f"\nTesting {url}...")
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("✅ Tariff Success!")
        print(json.dumps(response.json(), indent=2))
        return response.json()
    except Exception as e:
        print(f"❌ Tariff Failed: {e}")
        return None

def test_proposal(gen_data, roi_data, tariff_data):
    url = "http://localhost:8000/generate/proposal"
    
    # Construct complex payload
    payload = {
        "customer": {
            "name": "Cliente VIP Solar",
            "city": "São Paulo",
            "state": "SP"
        },
        "generation": gen_data,
        "financials": roi_data,
        "tariff": tariff_data
    }
    
    try:
        print(f"\nTesting {url}...")
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("✅ Proposal Success!")
        resp_json = response.json()
        print(f"ID: {resp_json['proposal_id']}")
        print(f"HTML Length: {len(resp_json['html_content'])} chars")
        return resp_json
    except Exception as e:
        print(f"❌ Proposal Failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
             print(e.response.text)

if __name__ == "__main__":
    tariff_data = test_tariff(500)
    gen_data = test_generation()
    
    if gen_data and tariff_data:
        # Cost approx R$ 3500/kWp
        cost = gen_data['system_size_kwp'] * 3500
        # Savings based on Tariff return
        tariff_val = tariff_data['total_rate_with_taxes']
        savings = gen_data['estimated_generation_monthly'] * tariff_val
        
        roi_data = test_roi(cost, savings)
        
        if roi_data:
            test_proposal(gen_data, roi_data, tariff_data)
