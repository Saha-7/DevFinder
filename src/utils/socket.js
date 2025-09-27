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
        //Handle events
      })
}

module.exports = initializeSocket