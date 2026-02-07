$baseUrl = "http://localhost:3001"
$creds = @{ email = "admin@test.com"; password = "password123" }
$headers = @{ "Content-Type" = "application/json" }

try {
    # 1. Login
    Write-Host "1. Logging in..." -ForegroundColor Cyan
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($creds | ConvertTo-Json) -Headers $headers
    $token = $loginRes.token
    if (-not $token) { throw "Login failed, no token." }
    $headers.Add("Authorization", "Bearer $token")
    Write-Host "   Token received." -ForegroundColor Green

    # 2. Get Lead (via Pipeline)
    Write-Host "2. Getting a Lead from Pipeline..." -ForegroundColor Cyan
    $pipeline = Invoke-RestMethod -Uri "$baseUrl/api/leads/pipeline" -Method Get -Headers $headers
    
    $leadId = $null
    if ($pipeline.columns) {
        foreach ($col in $pipeline.columns) {
            if ($col.leads -and $col.leads.Count -gt 0) {
                $leadId = $col.leads[0].id
                Write-Host "   Found Lead in column '$($col.title)': $($col.leads[0].name)" -ForegroundColor Green
                break
            }
        }
    }

    if (-not $leadId) { throw "No leads found in pipeline! Please run seed_data.js." }
    Write-Host "   Lead ID: $leadId" -ForegroundColor Green

    # 3. Get Kit (via inventory)
    Write-Host "3. Getting a Kit..." -ForegroundColor Cyan
    try {
        $kits = Invoke-RestMethod -Uri "$baseUrl/api/inventory/kits" -Method Get -Headers $headers
        if ($kits.Count -gt 0) { 
            $kitId = $kits[0].id
            Write-Host "   Kit ID: $kitId" -ForegroundColor Green
        }
        else {
            Write-Host "   No kits found." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "   Failed to list kits: $_" -ForegroundColor Red
    }

    # 4. Create Proposal (Orchestrator)
    Write-Host "4. Creating Proposal..." -ForegroundColor Cyan
    $body = @{ leadId = $leadId; consumption = 500 }
    try {
        $proposal = Invoke-RestMethod -Uri "$baseUrl/api/orchestrate/create-proposal" -Method Post -Body ($body | ConvertTo-Json) -Headers $headers
        # Check if proposal is direct object or nested
        if ($proposal.id) {
            $proposalId = $proposal.id
        }
        elseif ($proposal.proposal.id) {
            $proposalId = $proposal.proposal.id
        }
        else {
            # Helper: list proposals to find latest
            $latest = Invoke-RestMethod -Uri "$baseUrl/api/proposals?leadId=$leadId&limit=1" -Method Get -Headers $headers
            $proposalId = $latest[0].id
        }
        Write-Host "   Proposal Created: $proposalId" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to create proposal: $($_.Exception.Message)"
        exit 1
    }

    # 5. List Proposals
    Write-Host "5. Listing Proposals..." -ForegroundColor Cyan
    $proposals = Invoke-RestMethod -Uri "$baseUrl/api/proposals?leadId=$leadId&limit=5" -Method Get -Headers $headers
    Write-Host "   Found $($proposals.Count) proposals." -ForegroundColor Green
    
    # 6. Get Details
    Write-Host "6. Getting Proposal Details..." -ForegroundColor Cyan
    $detail = Invoke-RestMethod -Uri "$baseUrl/api/proposals/$proposalId" -Method Get -Headers $headers
    Write-Host "   Title: $($detail.title)" -ForegroundColor Green
    Write-Host "   Price: R$ $($detail.totalPrice)" -ForegroundColor Green

    # 7. Update Proposal
    Write-Host "7. Updating Proposal..." -ForegroundColor Cyan
    $updateBody = @{ discountPercent = 5; notes = "Test Discount" }
    $updated = Invoke-RestMethod -Uri "$baseUrl/api/proposals/$proposalId" -Method Patch -Body ($updateBody | ConvertTo-Json) -Headers $headers
    Write-Host "   Updated Discount: $($updated.discountPercent)%" -ForegroundColor Green

    # 8. Send
    Write-Host "8. Sending Proposal..." -ForegroundColor Cyan
    $sent = Invoke-RestMethod -Uri "$baseUrl/api/proposals/$proposalId/send" -Method Post -Headers $headers
    Write-Host "   Status: $($sent.proposal.status)" -ForegroundColor Green

    # 9. View
    Write-Host "9. Marking Viewed..." -ForegroundColor Cyan
    $viewed = Invoke-RestMethod -Uri "$baseUrl/api/proposals/$proposalId/view" -Method Post -Headers $headers
    Write-Host "   Status: $($viewed.proposal.status)" -ForegroundColor Green

    # 10. Accept
    Write-Host "10. Accepting Proposal..." -ForegroundColor Cyan
    try {
        $accepted = Invoke-RestMethod -Uri "$baseUrl/api/proposals/$proposalId/accept" -Method Post -Headers $headers
        Write-Host "   Status: $($accepted.proposal.status)" -ForegroundColor Green
    }
    catch {
        Write-Host "   Accept failed (maybe lead already closed?): $_" -ForegroundColor Yellow
    }

    # 11. Generate PDF
    Write-Host "11. Generating PDF..." -ForegroundColor Cyan
    try {
        $pdf = Invoke-RestMethod -Uri "$baseUrl/api/proposals/$proposalId/generate-pdf" -Method Post -Headers $headers
        if ($pdf.pdfUrl) {
            Write-Host "   PDF URL Generated: $($pdf.pdfUrl.Substring(0, 10))..." -ForegroundColor Green
        }
        else {
            Write-Host "   No PDF URL returned. Maybe python engine not running?" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "   PDF Generation failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    Write-Host "✅ TEST COMPLETE" -ForegroundColor Green

}
catch {
    Write-Error "Test Failed: $_"
}
