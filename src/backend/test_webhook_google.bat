@echo off
echo 🧪 Testando Webhook de Marketing - Google Ads
echo.

curl -X POST http://localhost:3001/api/marketing/webhook/google ^
  -H "Content-Type: application/json" ^
  -d "{\"google_key\":\"test_key_123\",\"lead_id\":\"lead_456\",\"user_column_data\":[{\"column_id\":\"FULL_NAME\",\"string_value\":\"Teste Webhook Google\"},{\"column_id\":\"EMAIL\",\"string_value\":\"teste.google@example.com\"},{\"column_id\":\"PHONE_NUMBER\",\"string_value\":\"21988776655\"},{\"column_id\":\"CITY\",\"string_value\":\"Rio de Janeiro\"},{\"column_id\":\"CONSUMPTION\",\"string_value\":\"720\"}]}"

echo.
echo.
echo ✅ Webhook Google enviado!
