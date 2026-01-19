# Initialize Git for Biala Books
Set-Location -Path "C:\Users\jdfri\biala-books"

Write-Host "Initializing Git repository..." -ForegroundColor Cyan

git init
git add .
git commit -m "Initial commit - Biala Publishing Website"

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "Git repository initialized!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a new repository on GitHub: https://github.com/new"
Write-Host "2. Name it: biala-books"
Write-Host "3. Run these commands:"
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/biala-books.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "4. Go to https://render.com"
Write-Host "5. Click 'New +' and select 'Blueprint'"
Write-Host "6. Connect your GitHub repo"
Write-Host "7. Render will auto-detect render.yaml and deploy"
Write-Host "====================================" -ForegroundColor Green

