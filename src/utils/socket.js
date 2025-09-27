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
        socket.on("joinChat", ()=>{})

        socket.on("sendMessage", ()=>{})

        socket.on("disconnect", ()=>{})
      })
}

module.exports = initializeSocket