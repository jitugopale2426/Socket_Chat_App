import { prismaClient } from "../index.js";

export const sendMessageController = async(req,res)=>{
    try {
        const {receiverId, text} = req.body;
        const senderId = req.user.id;

        if(!receiverId || !text){
            return res.status(400).json({message:"both receiverId and text is required"})
        }

        const message = await prismaClient.message.create({
            data:{
                senderId,
                receiverId,
                text
            }
        })

        return res.status(201).json({
            message : "Message sent sucessfully",
            data : message
        })
        
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }
}

export const getMessagesController = async(req,res)=>{
    try {
        const {receiverId} = req.params;
        const senderId = req.user.id;

        const messages = await prismaClient.message.findMany({
            where:{
                OR:[
                    {senderId,receiverId:parseInt(receiverId)},
                    {senderId:parseInt(receiverId),receiverId:senderId}
                ]
            },
            orderBy:{createdAt:"asc"}
        })

        return res.status(200).json({
            message:"Messages Fetch Successfully",
            messages
        })
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }
}