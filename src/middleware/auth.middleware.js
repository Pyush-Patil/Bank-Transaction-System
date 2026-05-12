const User=require("../models/user.model");
const jwt=require("jsonwebtoken");

async function authMiddleware(req,res,next)
{
    const token=req.cookies.token;
    if(!token)
    {
        return res.status(401).json({
            message:"User unauthorized, token not found"
        })
    }

    try
    {
           const decoded= await jwt.verify(token,process.env.JWT_SECRET);
           const user=await User.findById(decoded.userid)

           req.user=user;
           next();
    }
    catch(err)
    {
        return res.status(401).json({
            message:"User unauthorized, token not found",
            Error:err,
        })
    }
}

async function systemAuthMiddleware(req,res,next) {

    const token=req.cookies.token;
    if(!token)
    {
        return res.status(401).json({
            message :"Token not found"
        })
    }
    try
    {
          const decoded= jwt.verify(token,process.env.JWT_SECRET);
          const user= await User.findById(decoded.userid).select("+systemUser");
          if(!user.systemUser)
          {
              return res.status(401).json({
                message :"You're not an system admin"
              })
          }

          req.user=user;
          return next();

    }
    catch(err)
    {
       return res.status(401).json({
        message :'Unautorized Acess, token invalid'
       })
    }
    
}

module.exports={authMiddleware,systemAuthMiddleware};