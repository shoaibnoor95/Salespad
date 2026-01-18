# SalesPad Prototype Verification Script

$baseUrl = "http://localhost:3000"

$rand = Get-Random
Write-Host "`n1. Capturing Lead..." -ForegroundColor Cyan
$lead = Invoke-RestMethod -Uri "$baseUrl/lead" -Method Post -ContentType "application/json" -Body "{`"name`": `"John Doe`", `"email`": `"john$rand@example.com`"}"
$leadId = $lead.id
Write-Host "Lead Created: ID=$leadId"

Write-Host "`n2. Enqueueing Outbound Message..." -ForegroundColor Cyan
$send = Invoke-RestMethod -Uri "$baseUrl/send" -Method Post -ContentType "application/json" -Body "{`"leadId`": `"$leadId`", `"content`": `"Hi John, check out SalesPad!`"}"
Write-Host "Message Enqueued: $($send.message)"

Write-Host "`n3. Simulating Prospect Reply..." -ForegroundColor Cyan
$reply = Invoke-RestMethod -Uri "$baseUrl/reply" -Method Post -ContentType "application/json" -Body "{`"leadId`": `"$leadId`", `"content`": `"Tell me more about the AI agents.`"}"
Write-Host "Reply Logged: $($reply.message)"

Write-Host "`n4. Generating AI Response..." -ForegroundColor Cyan
$ai = Invoke-RestMethod -Uri "$baseUrl/ai/reply" -Method Post -ContentType "application/json" -Body "{`"leadId`": `"$leadId`"}"
Write-Host "AI Response Generated: $($ai.aiContent)"

Write-Host "`n5. Fetching Lead History & Status..." -ForegroundColor Cyan
$history = Invoke-RestMethod -Uri "$baseUrl/lead/$leadId" -Method Get
$history | ConvertTo-Json -Depth 10
