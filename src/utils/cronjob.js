const cron = require("node-cron")

const {subDays, startOfDay, endOfDay} = require("date-fns")
const ConnectionRequestModel = require("../models/connectionRequest")
const sendEmail = require("./sendEmail")

cron.schedule("05 21 * * *", async()=>{
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
                const subject = "🔔 You have new friend requests waiting!"
                const body = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2c5aa0; margin: 0; font-size: 28px;">DevFinder</h1>
                                <p style="color: #666; margin: 5px 0 0 0; font-size: 16px;">Connect with developers worldwide</p>
                            </div>
                            
                            <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Hello there! 👋</h2>
                            
                            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                Great news! You have new friend requests waiting for your response on DevFinder.
                            </p>
                            
                            <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2c5aa0; margin: 20px 0;">
                                <p style="color: #2c5aa0; font-weight: bold; margin: 0 0 10px 0; font-size: 18px;">📬 Pending Requests</p>
                                <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.5;">
                                    Some developers are interested in connecting with you! Don't keep them waiting - 
                                    login to your account to accept or decline their requests.
                                </p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="https://devfinder.live/login" 
                                   style="background-color: #2c5aa0; color: white; padding: 15px 30px; 
                                          text-decoration: none; border-radius: 5px; font-size: 16px; 
                                          font-weight: bold; display: inline-block;">
                                    Login to Your Account
                                </a>
                            </div>
                            
                            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                                <p style="color: #999; font-size: 14px; margin: 0; text-align: center;">
                                    This is an automated notification from DevFinder.<br>
                                    If you no longer wish to receive these emails, you can update your notification preferences in your account settings.
                                </p>
                            </div>
                        </div>
                    </div>
                `
                
                const res = await sendEmail.run(subject, body)
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

