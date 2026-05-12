const Account=require("../models/account.model");
const User=require("../models/user.model");


async function createAccountController(req,res)
{
    const user=req.user;

    const account= await Account.create({
        user:user._id,
    })

    res.status(201).json({
        account
    })

}

async function getallAccounts(req,res) {

    const user=req.user._id;

    const accounts=await Account.find({user:user._id});

    if(!accounts)
    {
        return res.status(401).json({
            message :"No account is associated with this user"
        })
    };

    return res.status(201).json({
        message : "successfull",
        accounts:accounts,
    })
}

module.exports={
    createAccountController,getallAccounts
};