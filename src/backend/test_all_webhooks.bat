@echo off
echo ========================================
echo 🚀 TESTE COMPLETO - WEBHOOKS DE MARKETING
echo ========================================
echo.

echo [1/3] Testando Facebook Lead Ads...
call test_webhook_facebook.bat
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Testando Google Ads...
call test_webhook_google.bat
timeout /t 2 /nobreak >nul

echo.
echo [3/3] Testando TikTok Lead Generation...
call test_webhook_tiktok.bat

echo.
echo ========================================
echo ✅ TODOS OS WEBHOOKS TESTADOS!
echo ========================================
echo.
echo 💡 Verifique o banco de dados ou os logs do servidor para confirmar a criação dos leads.
echo.
pause
