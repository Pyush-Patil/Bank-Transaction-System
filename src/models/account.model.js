const mongoose=require("mongoose");
const { type } = require("node:os");
const Ledger= require("../models/ledger.model")
const accountSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Account must be associated with a user"],
        index:true,
    },
    status:{
        type:String,
        value:["ACTIVE","FROZEN","CLOSED"],
        message : "Account can be either Active , Frozen or closed",
        default:"ACTIVE",
        },
    currecny:{
        type:String,
        required:true,
        default:"INR",
        }
},{timestamps:true});

accountSchema.index({user:1,status:1});

accountSchema.method.getbalance= async function (params) {

    const balancedata= await Ledger.aggregate([
        {$match :{account: this._id}},
        {$group :{_id:null,
            totaldebit:{
                $sum:{
                    $cond :[
                        {$eq : ["$type", "DEBIT"]},
                        "$amount",
                        0
                    ]
                }
            },
            totalcredit:{
                $sum:{
                    $cond :[
                        {$eq : ["$type", "CREDIT"]},
                        "$amount",
                        0
                    ]
                }
            }
        }},
        {$project:{_id:0,balance:{$subtract:["$totalcredit","$totaldebit"]}}}
    ])
    
    if(balancedata.length ===0)
    {
        return 0;
    }

    return balancedata[0].balance;
}

const Account=mongoose.model("Account",accountSchema);

module.exports=Account;