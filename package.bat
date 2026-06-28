@echo off
echo ===================================================
echo Packaging DrawingPerspectiveLab for Deployment
echo ===================================================
echo.
echo Removing old package if it exists...
powershell -Command "if (Test-Path perspective-lab-deploy.zip) { Remove-Item perspective-lab-deploy.zip }"

echo Creating new deployment zip file...
powershell -Command "Compress-Archive -Path index.html, app.js, styles.css -DestinationPath perspective-lab-deploy.zip"

echo.
echo ===================================================
echo SUCCESS! Created: perspective-lab-deploy.zip
echo ===================================================
echo.
pause
