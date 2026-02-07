$baseUrl = "http://localhost:3001"
$creds = @{ email = "admin@test.com"; password = "password123" }
$headers = @{ "Content-Type" = "application/json" }
$logFile = "d:\QUARKS_OS\test_error.txt"

"Processing..." | Set-Content $logFile

try {
    # Login
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($creds | ConvertTo-Json) -Headers $headers
    $headers.Add("Authorization", "Bearer $($loginRes.token)")
    "Login Token: $($loginRes.token.Substring(0,10))..." | Add-Content $logFile
    
    # Get Pipeline
    $pipeline = Invoke-RestMethod -Uri "$baseUrl/api/leads/pipeline" -Method Get -Headers $headers
    
    $leadId = $null
    
    # Dumb check
    if ($pipeline.NEW -and $pipeline.NEW.Count -gt 0) { $leadId = $pipeline.NEW[0].id; "Found in NEW" | Add-Content $logFile }
    elseif ($pipeline.CONTACTED -and $pipeline.CONTACTED.Count -gt 0) { $leadId = $pipeline.CONTACTED[0].id; "Found in CONTACTED" | Add-Content $logFile }
    elseif ($pipeline.PROPOSAL_SENT -and $pipeline.PROPOSAL_SENT.Count -gt 0) { $leadId = $pipeline.PROPOSAL_SENT[0].id; "Found in PROPOSAL_SENT" | Add-Content $logFile }
    elseif ($pipeline.NEGOTIATION -and $pipeline.NEGOTIATION.Count -gt 0) { $leadId = $pipeline.NEGOTIATION[0].id; "Found in NEGOTIATION" | Add-Content $logFile }
    
    if (-not $leadId) { throw "No leads found in NEW/CONTACTED/PROPOSAL_SENT/NEGOTIATION." }
    "Selected Lead ID: $leadId" | Add-Content $logFile
    
    # Create Proposal
    $body = @{ leadId = $leadId; consumption = 600 }
    $res = Invoke-RestMethod -Uri "$baseUrl/api/orchestrate/create-proposal" -Method Post -Body ($body | ConvertTo-Json) -Headers $headers
    
    "SUCCESS" | Set-Content $logFile
    if ($res.id) { "Proposal ID: $($res.id)" | Add-Content $logFile }
    elseif ($res.proposal -and $res.proposal.id) { "Proposal ID: $($res.proposal.id)" | Add-Content $logFile }
    else { ("Result: " + ($res | ConvertTo-Json -Depth 2)) | Add-Content $logFile }
    
}
catch {
    $e = $_.Exception
    $msg = "ERROR: $($e.Message)"
    if ($e.Response) {
        $reader = New-Object System.IO.StreamReader($e.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        $msg += "`nRESPONSE BODY: $body"
    }
    $msg | Set-Content $logFile
}
