import { prismaClient } from "../index.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

export const RegisterController = async (req,res)=>{
    try {
        const {username,email,password} = req.body;

        if(!username || !email || !password ){
            return res.status(400).json({message:"All fields are required"})
        }

        const userExists = await prismaClient.user.findUnique({
            where:{email:email}
        })

        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }

        const hashPassword = await hashSync(password,10)

        const user = await prismaClient.user.create({
            data:{
                username,
                email,
                password:hashPassword
            }
        })

        return res.status(201).json({message:"User Registered Successfully",user})
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }
}

export const LoginController = async (req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password ){
            return res.status(400).json({message:"All fields are required"})
        }

        const userExists = await prismaClient.user.findUnique({
            where:{email:email}
        })

        if(!userExists){
            return res.status(404).json({message:"User not found"})
        }

        const comparePassword = await compareSync(password,userExists.password)
        if(!comparePassword){
            return res.status(400).json({message:"Invalid Password"})
        }

        const token = await jwt.sign({id:userExists.id},process.env.JWT_SECRET,{expiresIn:'1d'})

        return res.status(200).json({message:"User Logged In Successfully",token,userExists})
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }
}

export const getUserController = async(req,res)=>{
    try {
        const userId = req.user.id;

        if(!userId){
            return res.status(404).json({message:"User not found"})
        }

        const user = await prismaClient.user.findMany({
            where:{id:{not:userId}},
            select:{id:true,username:true,password:true}
        })

        return res.status(200).json({message:"Users Fetch Successfully",user})
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }
}