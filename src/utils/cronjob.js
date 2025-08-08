const cron = require("node-cron")

const {subDays, startOfDay, endOfDay} = require("date-fns")
const ConnectionRequestModel = require("../models/connectionRequest")
const sendEmail = require("./sendEmail")

cron.schedule("45 20 * * *", async()=>{
    // Send mail to those people who got Request from Yesterday
    try{
        const yesterday = subDays(new Date(),1)

        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId")

        const listOfEmails = [...new Set(pendingRequests.map(req=> req.toUserId.email))]

        console.log(listOfEmails);
        

        for(const email of listOfEmails){
            // Send emails
            try{
                const res = await sendEmail.run("New Friend Requests pending for " + email + ", Please login to your account in order to accept/reject the request.")
                console.log(res)
            }
            catch(err){
                console.log(err)
            }
        }

    }catch(err){
        console.log(err)
    }
})

