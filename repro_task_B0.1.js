const { io } = require("socket.io-client");

const socket = io("http://localhost:3001", {
    autoConnect: false,
    timeout: 5000
});

console.log("Tentando conectar ao WebSocket do servidor Quarks OS (Porta 3001)...");

socket.on("connect", () => {
    console.log("✅ Sucesso: Conectado ao WebSocket!");
    process.exit(0);
});

socket.on("connect_error", (error) => {
    console.error("❌ Falha: Não foi possível conectar ao WebSocket.");
    console.error("Erro:", error.message);
    process.exit(1);
});

socket.connect();

setTimeout(() => {
    console.error("⏳ Timeout: Servidor WebSocket não respondeu.");
    process.exit(1);
}, 10000);
