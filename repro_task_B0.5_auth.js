const { io } = require("socket.io-client");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./src/backend/.env" });

const token = jwt.sign(
    { id: "test-user-id", email: "test@quarks.solar", role: "ADMIN" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);

const socket = io("http://localhost:3001", {
    auth: { token },
    autoConnect: false,
    timeout: 5000
});

console.log("Tentando conectar ao WebSocket com TOKEN VÁLIDO...");

socket.on("connect", () => {
    console.log("✅ Sucesso: Conectado e Autenticado!");
    process.exit(0);
});

socket.on("connect_error", (error) => {
    console.error("❌ Falha na autenticação ou conexão.");
    console.error("Erro:", error.message);
    process.exit(1);
});

socket.connect();

setTimeout(() => {
    console.error("⏳ Timeout.");
    process.exit(1);
}, 10000);
