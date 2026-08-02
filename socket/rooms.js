module.exports = (io, socket) => {

    console.log("Room events registered");

    socket.on("join-conversation", (conversationId) => {

        console.log("join-conversation event received");

        socket.join(conversationId);

        console.log(`${socket.id} joined ${conversationId}`);

    });

};