const User=require("../models/user.model");
const jwt=require("jsonwebtoken")
const emailServices=require("../services/email.services")

async function userRegistercontroller(req,res) {

    const {name,email,password}=req.body;

    const isExists= await User.findOne({email:email});

    if(isExists)
    {
        return res.status(400).json({
            message : "Email already exists"
        })
    }
    
    const user=await User.create({
        name,email,password
    });

    const token=jwt.sign({userid:user._id},process.env.JWT_SECRET,{expiresIn:"24h"});
    
    res.cookie("token",token);
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
        },
        token
    })

    await emailServices.sendRegistrationemail(user.email,user.name);
}

async function userLogincontroller(req,res)
{
    const {email,password}=req.body;

    const user= await User.findOne({email:email}).select("+password");
    if(!user)
    {
        return res.status(401).json({message : "Enter a valid email or password"});
    }

    const isvalidpassword= await user.comparePassword(password);
    if(!isvalidpassword)
    {
        return res.status(401).json({message : "Enter a valid email or password"});
    }
    

    const token=jwt.sign({userid:user._id},process.env.JWT_SECRET,{expiresIn:"24h"});

    res.cookie("token",token);
    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
        },
        token,
        message : "User Logged in successfully",
    })


}

 
module.exports={userRegistercontroller,userLogincontroller}