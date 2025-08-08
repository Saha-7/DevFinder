const cron = require("node-cron")

cron.schedule("0 9 * * *", ()=>{
    console.log("Hello World, " + new Date());   
})

