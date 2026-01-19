@echo off
echo Initializing Git repository...
cd /d C:\Users\jdfri\biala-books

git init
git add .
git commit -m "Initial commit - Biala Publishing Website"

echo.
echo ====================================
echo Git repository initialized!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub: https://github.com/new
echo 2. Name it: biala-books
echo 3. Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/biala-books.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Go to https://render.com
echo 5. Click "New +" and select "Blueprint"
echo 6. Connect your GitHub repo
echo 7. Render will auto-detect render.yaml and deploy
echo ====================================
pause

