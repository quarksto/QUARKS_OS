@echo off
echo 🧪 Testando Webhook de Marketing - TikTok
echo.

curl -X POST http://localhost:3001/api/marketing/webhook/tiktok ^
  -H "Content-Type: application/json" ^
  -d "{\"page_id\":\"page_789\",\"ad_id\":\"ad_101\",\"form_id\":\"form_202\",\"leads\":[{\"field_data\":{\"name\":\"Teste Webhook TikTok\",\"email\":\"teste.tiktok@example.com\",\"phone\":\"31977665544\",\"city\":\"Belo Horizonte\",\"consumo_kwh\":\"890\"}}]}"

echo.
echo.
echo ✅ Webhook TikTok enviado!
