@echo off
echo 🧪 Testando Webhook de Marketing - Facebook
echo.

curl -X POST http://localhost:3001/api/marketing/webhook/facebook ^
  -H "Content-Type: application/json" ^
  -d "{\"entry\":[{\"changes\":[{\"value\":{\"form_id\":\"123456\",\"field_data\":[{\"name\":\"full_name\",\"values\":[\"Teste Webhook FB\"]},{\"name\":\"email\",\"values\":[\"teste.fb@example.com\"]},{\"name\":\"phone_number\",\"values\":[\"11999887766\"]},{\"name\":\"cidade\",\"values\":[\"Campinas\"]},{\"name\":\"consumo\",\"values\":[\"650\"]}]}}]}]}"

echo.
echo.
echo ✅ Webhook enviado! Verifique os logs do servidor.
