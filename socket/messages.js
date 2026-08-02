module.exports = (io, socket) => {

    socket.on("send-message", (data) => {

        io.to(data.conversationId).emit(
            "receive-message",
            data
        );

    });

};