const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

const conversationId = "6a6ab4065cd2cb7964d41267";

socket.on("connect", () => {
    console.log("Buyer connected:", socket.id);
    socket.emit("join-conversation", conversationId);
});

socket.on("receive-message", (message) => {
    console.log("Buyer received:", message);
});