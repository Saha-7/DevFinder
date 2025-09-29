const socket = require("socket.io")


const initializeSocket =(server) =>{
    // Create a socket instance for the server
    const io = socket(server, {
        cors: {
          origin: "http://localhost:5173",
          credentials: true,
        },
      })

      //Handle connection
      io.on("connection", (socket)=>{
        //Handling different events
        socket.on("joinChat", ({firstName ,userId, targetUserId})=>{
          const roomId = [userId, targetUserId].sort().join("_")
          console.log(firstName + "User joined the chat room " + roomId)
          socket.join(roomId)
        })

        socket.on("sendMessage", ()=>{})

        socket.on("disconnect", ()=>{})
      })
}

module.exports = initializeSocket