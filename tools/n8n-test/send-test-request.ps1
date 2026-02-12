# n8n Webhook Test Script (PowerShell)
# 
# Sends authenticated requests to n8n webhook endpoints for testing.
# Reads webhook URL and auth token from .env file.
#
# Usage:
#   .\tools\n8n-test\send-test-request.ps1

# Load environment variables from .env file
function Load-EnvFile {
    param([string]$FilePath)
    
    if (Test-Path $FilePath) {
        Get-Content $FilePath | ForEach-Object {
            if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                # Remove quotes if present
                $value = $value -replace '^["'']|["'']$', ''
                [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            }
        }
    }
}

# Get project root directory (two levels up from script location)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)

# Load .env files (check both .env and .env.local)
$envPath = Join-Path $projectRoot ".env"
$envLocalPath = Join-Path $projectRoot ".env.local"

Load-EnvFile -FilePath $envPath
Load-EnvFile -FilePath $envLocalPath

# Get webhook URL and auth token from environment
$webhookUrl = $env:VITE_N8N_WEBHOOK_URL
if (-not $webhookUrl) {
    $webhookUrl = $env:N8N_WEBHOOK_URL
}

$authToken = $env:VITE_N8N_AUTH_TOKEN
if (-not $authToken) {
    $authToken = $env:VITE_N8N_JWT_TOKEN
}
if (-not $authToken) {
    $authToken = $env:N8N_AUTH_TOKEN
}

# Validate required environment variables
if (-not $webhookUrl -or $webhookUrl.Trim() -eq '') {
    Write-Host "[ERROR] Webhook URL is required. Set VITE_N8N_WEBHOOK_URL or N8N_WEBHOOK_URL in .env file" -ForegroundColor Red
    exit 1
}

if (-not $authToken -or $authToken.Trim() -eq '') {
    Write-Host "[ERROR] Authentication token is required. Set VITE_N8N_AUTH_TOKEN or N8N_AUTH_TOKEN in .env file" -ForegroundColor Red
    exit 1
}

# Test data in user format
$userData = @(
    @{
        Name = "João Alexandre de Oliveira Maia"
        Email = "joaomaia.trabalho@gmail.com"
        Subject = "Title: Project"
        Message = "Hello, you are available to talk ?"
        Phone = "+351931308090"
        CompanyName = "HPRS"
        CompanyID = "515843466"
    }
)

# Function to map user data to ContactFormData format
function ConvertTo-ContactFormData {
    param([hashtable]$InputData)
    
    $contactData = @{
        name = $InputData.Name
        email = $InputData.Email
        subject = $InputData.Subject
        message = $InputData.Message
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
    
    # Optional fields
    if ($InputData.Phone) {
        $contactData.phone = $InputData.Phone
    }
    if ($InputData.CompanyName) {
        $contactData.companyName = $InputData.CompanyName
    }
    if ($InputData.CompanyID) {
        $contactData.companyIdentifier = $InputData.CompanyID
    }
    
    return $contactData
}

# Validate required fields
function Test-ContactFormData {
    param([hashtable]$Data)
    
    $errors = @()
    
    if (-not $Data.name -or $Data.name.Trim() -eq '') {
        $errors += "name is required"
    }
    if (-not $Data.email -or $Data.email.Trim() -eq '') {
        $errors += "email is required"
    }
    if (-not $Data.subject -or $Data.subject.Trim() -eq '') {
        $errors += "subject is required"
    }
    if (-not $Data.message -or $Data.message.Trim() -eq '') {
        $errors += "message is required"
    }
    
    if ($errors.Count -gt 0) {
        throw "Validation failed: $($errors -join ', ')"
    }
}

# Main execution
Write-Host "n8n Webhook Test Script (PowerShell)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Webhook URL: $webhookUrl" -ForegroundColor Yellow
Write-Host "Auth Token: $($authToken.Substring(0, [Math]::Min(8, $authToken.Length)))..." -ForegroundColor Yellow
Write-Host ""

# Process each data item
$requestNumber = 0
foreach ($item in $userData) {
    $requestNumber++
    
    Write-Host "Processing request $requestNumber/$($userData.Count)..." -ForegroundColor Cyan
    Write-Host "   Name: $($item.Name)" -ForegroundColor Gray
    Write-Host "   Email: $($item.Email)" -ForegroundColor Gray
    Write-Host "   Subject: $($item.Subject)" -ForegroundColor Gray
    
    try {
        # Convert to ContactFormData format
        $contactData = ConvertTo-ContactFormData -InputData $item
        
        # Validate
        Test-ContactFormData -Data $contactData
        
        # Convert to JSON
        $jsonBody = $contactData | ConvertTo-Json -Compress
        
        # Prepare headers
        $headers = @{
            "Content-Type" = "application/json"
            "X-API-Key" = $authToken
        }
        
        # Send POST request
        try {
            $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Headers $headers -Body $jsonBody -ContentType "application/json" -ErrorAction Stop
            
            Write-Host "   [SUCCESS] Request sent successfully!" -ForegroundColor Green
            if ($response) {
                Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
            }
        }
        catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            $errorMessage = $_.Exception.Message
            
            Write-Host "   [FAILED] Request failed!" -ForegroundColor Red
            Write-Host "   Status Code: $statusCode" -ForegroundColor Red
            Write-Host "   Error: $errorMessage" -ForegroundColor Red
            
            # Try to get error response body
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                if ($responseBody) {
                    Write-Host "   Response Body: $responseBody" -ForegroundColor Red
                }
            }
            catch {
                # Ignore if we can't read the response
            }
        }
    }
    catch {
        Write-Host "   [VALIDATION ERROR]: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Done!" -ForegroundColor Green

