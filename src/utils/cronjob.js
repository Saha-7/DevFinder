const cron = require("node-cron")

const {subDays, startOfDay, endOfDay} = require("date-fns")
const ConnectionRequestModel = require("../models/connectionRequest")

cron.schedule("0 9 * * *", ()=>{
    // Send mail to those people who got Request from Yesterday
    try{

        const yesterday = subDays(new Date(),1)

        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)

        const pendingRequests = ConnectionRequestModel.find({
            status: "interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        })

    }catch(err){
        console.log(err)
    }
})

