const cron = require("node-cron")

cron.schedule("* * * * * *", ()=>{
    console.log("Hello World, " + new Date());   
})

