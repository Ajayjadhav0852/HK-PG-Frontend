# Upload new HK PG logo to Cloudinary
$cloudName = "dzr0crkvr"
$apiKey = "366447514547635"
$apiSecret = "IUdHiXU8H3Uu3Z-l2JyJLa9hueY"

# Build auth string
$authBytes = [System.Text.Encoding]::ASCII.GetBytes("${apiKey}:${apiSecret}")
$authB64 = [Convert]::ToBase64String($authBytes)

# Upload the new logo
$logoPath = "public/hkpg-logo.png"

if (-not (Test-Path $logoPath)) {
    Write-Host "ERROR: Logo file not found at $logoPath" -ForegroundColor Red
    Write-Host "Please save the new logo image as public/hkpg-logo.png first" -ForegroundColor Yellow
    exit 1
}

Write-Host "Uploading new logo to Cloudinary..." -ForegroundColor Cyan

$boundary = [System.Guid]::NewGuid().ToString()
$fileBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $logoPath))
$fileContent = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes)

$body = "--$boundary`r`n"
$body += "Content-Disposition: form-data; name=`"file`"; filename=`"hkpg-new-logo.png`"`r`n"
$body += "Content-Type: image/png`r`n`r`n"
$body += $fileContent + "`r`n"
$body += "--$boundary`r`n"
$body += "Content-Disposition: form-data; name=`"public_id`"`r`n`r`nhkpg/logo/hkpg-new-logo`r`n"
$body += "--$boundary`r`n"
$body += "Content-Disposition: form-data; name=`"overwrite`"`r`n`r`ntrue`r`n"
$body += "--$boundary`r`n"
$body += "Content-Disposition: form-data; name=`"invalidate`"`r`n`r`ntrue`r`n"
$body += "--$boundary--"

$bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)

try {
    $response = Invoke-RestMethod `
      -Uri "https://api.cloudinary.com/v1_1/$cloudName/image/upload" `
      -Method POST `
      -Headers @{ Authorization = "Basic $authB64" } `
      -ContentType "multipart/form-data; boundary=$boundary" `
      -Body $bodyBytes

    Write-Host "✅ SUCCESS! Logo uploaded to Cloudinary" -ForegroundColor Green
    Write-Host "URL: $($response.secure_url)" -ForegroundColor Cyan
    Write-Host "`nThe website will now use the new logo!" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
