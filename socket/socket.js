const registerRoomEvents = require("./rooms");
const registerMessageEvents = require("./messages");

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log(`User connected: ${socket.id}`);

        registerRoomEvents(io, socket);
        registerMessageEvents(io, socket);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });

    });

};