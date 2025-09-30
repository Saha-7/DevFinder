const socket = require("socket.io")
const crypto = require("crypto")

const getSecretRoomId =(userId, targetUserId)=>{
  return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}


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
          const roomId = getSecretRoomId(userId, targetUserId)
          console.log(firstName + " joined the chat room " + roomId)
          socket.join(roomId)
        })

        socket.on("sendMessage", ({firstName ,userId, targetUserId, text})=>{
          const roomId = getSecretRoomId(userId, targetUserId)
          console.log(firstName + " sent a message: " + text + " to " + targetUserId)
          io.to(roomId).emit("messageReceived", {firstName, text})
          
        })

        socket.on("disconnect", ()=>{})
      })
}

module.exports = initializeSocket