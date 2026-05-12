const mongoose=require("mongoose");

const transactionSchema= new mongoose.Schema({
    
    fromaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must be associated with a from account"],
        index:true,
    },
    toaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must be associated with to account"],
        index:true,
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Staus can be either Pending , completed , failed or reversed",
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true, "please enter a amount to proceed the transaction"],
        min:[0,"Amount can't be negative"],
    },
    idempotencykey:{
        type:String,
        required:[true,"Key is required"],
        unique:true,
        index:true,
    }
},{timestamps:true});

const Transaction= mongoose.model("transaction",transactionSchema);

module.exports=Transaction;