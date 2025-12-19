import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import rooRouter from "./routes/index.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cors({
    origin:'*',
    methods:['GET','PUT','POST','DELETE'],
    allowedHeaders:['Content-Type','auth-token']
}))

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Backend Running")
})

app.use('/api',rooRouter);

export const prismaClient = new PrismaClient({
    log:['query']
})

const server = http.createServer(app);

const io = new Server(server,{
    cors :{origin: "*"}
})

const onlineUsers = new Map();

io.on("connection",(socket)=>{
    console.log("User Connected :", socket.id);

    socket.on("addUser",(userId)=>{
        onlineUsers.set(userId,socket.id)
    })

    socket.on("sendMessage",async ({senderId, chatSessionId, text})=>{
        const message = await prismaClient.message.create({
            data:{senderId,chatSessionId,text}
        })

        const users = await prismaClient.chatSessionUser.findMany({
            where:{chatSessionId}
        })

        users.forEach(({userId}) =>{
            const socketId = onlineUsers.get(userId);
              if(socketId){
            io.to(socketId).emit("receiveMessage",message);
        }
        })

      
    })

    socket.on("disconnect",()=>{
        for(let [id,socketId] of onlineUsers.entries()){
            if(socketId === socket.id) onlineUsers.delete(id);
        }
    })
})

server.listen(PORT,()=>{
    console.log(`Server running on port no ${PORT}`)
})