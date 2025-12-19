import { prismaClient } from "../index.js";

export const sendMessageController = async(req,res)=>{
    try {
        const {chatSessionId, text} = req.body;
        const senderId = req.user.id;

        if(!chatSessionId || !text){
            return res.status(400).json({message:"both chatSessionId and text is required"})
        }

        const message = await prismaClient.message.create({
            data:{
                senderId,
                chatSessionId,
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
        const {chatSessionId} = req.params;

        const messages = await prismaClient.message.findMany({
            where:{
               chatSessionId: Number(chatSessionId),
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