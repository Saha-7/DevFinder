const cron = require("node-cron")

const {subDays} = require("date-fns")

cron.schedule("0 9 * * *", ()=>{
    // Send mail to those people who got Request from Yesterday
    try{

    }catch(err){
        console.log(err)
    }
})

