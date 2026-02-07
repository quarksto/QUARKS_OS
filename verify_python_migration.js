const BASE_URL = 'http://localhost:8000/api';

async function verify() {
    console.log("=== Starting Python Backend Verification (Native Check) ===");

    // 1. Health Check
    try {
        const res = await fetch('http://localhost:8000/health');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        console.log("✅ Health Check Passed:", data);
    } catch (e) {
        console.error("❌ Health Check Failed:", e.message);
        // process.exit(1); 
    }

    // 2. Auth (Register/Login)
    let token = "";
    let userId = "";
    const email = `test-${Date.now()}@quarks.os`;
    const password = "password123";

    try {
        console.log(`\nTesting Register (${email})...`);
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name: "Test User" })
        });

        if (regRes.ok) {
            console.log("✅ Register Passed");
        } else {
            const err = await regRes.text();
            console.log("ℹ️ Register info:", err); // Might be "already exists" which is fine
        }

        console.log("Testing Login...");
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) throw new Error(await loginRes.text());

        const loginData = await loginRes.json();
        console.log("✅ Login Passed");
        token = loginData.access_token;
        userId = loginData.user.id;

    } catch (e) {
        console.error("❌ Auth Failed:", e.message);
    }

    // 3. Leads
    if (token) {
        try {
            console.log("\nTesting Leads...");
            const createRes = await fetch(`${BASE_URL}/leads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: "Lead Native",
                    consumption: 450.5
                })
            });

            if (createRes.ok) {
                const lead = await createRes.json();
                console.log("✅ Create Lead Passed:", lead.id);
            } else {
                console.error("❌ Create Lead Failed:", await createRes.text());
            }

            const listRes = await fetch(`${BASE_URL}/leads/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (listRes.ok) {
                const list = await listRes.json();
                console.log(`✅ List Leads Passed: Found ${list.length} leads`);
            }

        } catch (e) {
            console.error("❌ Leads Failed:", e.message);
        }
    }

    // 4. Copilot (Chat)
    try {
        console.log("\nTesting Copilot Chat...");
        const formData = new FormData();
        formData.append('message', 'Hello Python Copilot');
        formData.append('userId', userId || 'test-user');

        const chatRes = await fetch(`${BASE_URL}/copilot/chat`, {
            method: 'POST',
            body: formData
            // Note: fetch automatically sets Content-Type boundary for FormData
        });

        if (!chatRes.ok) throw new Error(await chatRes.text());

        const chatData = await chatRes.json();
        console.log("✅ Copilot Chat Passed:", chatData);
    } catch (e) {
        console.error("❌ Copilot Failed:", e.message);
    }
}

verify();
