const Transaction=require("../models/transaction.model");
const Account=require("../models/account.model");
const Ledger=require("../models/ledger.model");
const emailServices=require("../services/email.services");
const { default: mongoose } = require("mongoose");

async function createTransaction(req,res){

    //1* Validate Request
    const {fromaccount,toaccount,amount,idempotencykey}=req.body;

    if(!fromaccount || !toaccount || !amount || !idempotencykey)
    {
        return res.status(401).json({
            message : "fromaccount, toacccount, amount and idempotencykey are required",
        })
    }

    //2* Check account status
    const fromUseraccount=await Account.findOne({
        _id:fromaccount
    });

    const toUseraccount=await Account.findOne({
        _id:toaccount
    });

    if(!fromUseraccount ||!toUseraccount )
    {
        return res.status(401).json({
            message : "fromaccount or toaccound doesnt exists"
        })
    }

    //3* Validate Idempotency key
    const isTransactionalreadyexists= await Transaction.findOne({
        idempotencykey:idempotencykey,
    })

    if(isTransactionalreadyexists)
    {
         if(isTransactionalreadyexists.status=="COMPLETED")
         {
            return res.status(200).json({
                message : "Transaction already processed",
                transaction : isTransactionalreadyexists
            })
         }

         if(isTransactionalreadyexists.status=="PENDING")
         {
            return res.status(400).json({
                message : "Transaction already is in process"
            })
         }
         if(isTransactionalreadyexists.status=="FAILED")
         {
            return res.status(400).json({
                message : "Transaction failed, please try again"
            })
         }

         if(isTransactionalreadyexists.status=="REVERSED")
         {
            return res.status(400).json({
                message : "Transaction reversed, please try again"
            })
         }
    }

    //4* Derive Sender's balance
    const balance = await fromUseraccount.getbalance();

    if(balance<amount)
    {
        return res.status(400).json({
            message : `Insufficient Balance, Currect balance is ${balance}`
        })
    }

    //5* Create Transaction

    const session= await mongoose.startSession();
    session.createTransaction();

    const transaction=await Transaction.create({
        fromaccount:fromaccount,
        toaccount:toaccount,
        amount:amount,
        idempotencykey:idempotencykey
    },{session});

    const debitLedgerentry=await Ledger.create({
        account:fromaccount,
        transaction:transaction._id,
        amount:amount,
        type:"DEBIT"
    },{session});
    const creditLedgerentry=await Ledger.create({
        account:toaccount,
        transaction:transaction._id,
        amount:amount,
        type:"CREDIT"
    },{session});

    transaction.status ="COMPLETED";
    await transaction.save({session});

    session.commitTransaction();
    session.endSession();

    await emailServices.sendTransactionFailedemail(req.user.email,req.user.name,amount,toaccount);

    return res.status(200).json({
        message :"Transaction Successfull",
        transaction,
        debitLedgerentry,
        creditLedgerentry
    })

}


async function createInitialfundsTransaction(req,res)
{
    const {toaccount,amount,idempotencykey}=req.body;

    if(!toaccount || !amount || !idempotencykey)
    {
        return res.status(401).json({
            message : "toaccount , amount and idempotency key are required"
        })
    }

    const toUseraccount= await Account.findOne({
        _id:toaccount,
    });
    if(!toUseraccount)
    {
        return res.status(401).json({
            message :"toaccount not found",
        })
    }

    const fromUseraccount= await Account.findOne({
        user:req.user._id,
    });

    if(!fromUseraccount)
    {
        return res.status(401).json({
            message :"System account not found",
        })
    }

    const session=await mongoose.startSession();
    session.startTransaction();

    const transaction=new Transaction({
        fromaccount:fromUseraccount._id,
        amount:amount,
        idempotencykey:idempotencykey,
        toaccount:toaccount,
        status:"PENDING",
    });

    const debitLedgerentry= await Ledger.create([{
        account:fromUseraccount._id,
        type:"DEBIT",
        amount:amount,
        transaction:transaction._id,
    }],{session});

    const creditLedgerentry= await Ledger.create([{
        account:toaccount,
        type:"CREDIT",
        amount:amount,
        transaction:transaction._id,
    }],{session});

    transaction.status="COMPLETED";
   await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message:"Initial Funds Transaction successfully completed",
        transaction,
        debitLedgerentry,
        creditLedgerentry
    })
}


module.exports={createInitialfundsTransaction,createTransaction}

