import { prismaClient } from "../index.js";


export const getOrCreateChatSession = async (req,res)=>{
    try {
        const userId = req.user.id;
        const {otherUserId} = req.body;

        let session = await prismaClient.chatSession.findFirst({
            where:{
                users:{
                    every:{
                        userId: { in:[userId,otherUserId]}
                    }
                }
            }
        })

        if(!session){
            session = await prismaClient.chatSession.create({
                data:{
                    users:{
                        create:[
                            {userId},
                            {userId:otherUserId}
                        ]
                    }
                }
            })
        }

        res.json(session)
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}