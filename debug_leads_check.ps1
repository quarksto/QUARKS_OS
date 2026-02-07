$baseUrl = "http://localhost:3001"
$creds = @{ email = "admin@test.com"; password = "password123" }
$loginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($creds | ConvertTo-Json) -Headers @{ "Content-Type" = "application/json" }
$headers = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $($loginRes.token)" }
$pipeline = Invoke-RestMethod -Uri "$baseUrl/api/leads/pipeline" -Method Get -Headers $headers
$pipeline | ConvertTo-Json -Depth 5
