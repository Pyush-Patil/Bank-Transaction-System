const mongoose=require("mongoose");
const Transaction = require("./transaction.model");

const ledgerSchema= new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Account no. is required to create an entry in ledger"],
        immutable:true,
        index:true,
    },
    amount:{
        type:Number,
        required:[true,"Amount is required to create an entry in ledger"],
        immutable:true,
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required: [true, "Transaction_id is required"],
        immutable:true,
        index:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message :"Transaction type can be either debited or credited "
        },
        required:[true,"Ledger type is required"],
        immutable:true,
    }
});

ledgerSchema.pre("save", function(next) {
    if (!this.isNew) {
        throw new Error("Ledger entries are immutable, cannot be updated or modified");
    }
});


const preventQueryModification = function(next) {
    return next(new Error("Ledger entries are immutable, cannot be updated or modified"));
};

ledgerSchema.pre("update", preventQueryModification);
ledgerSchema.pre("updateOne", preventQueryModification);
ledgerSchema.pre("updateMany", preventQueryModification);
ledgerSchema.pre("findOneAndUpdate", preventQueryModification);
ledgerSchema.pre("delete", preventQueryModification);
ledgerSchema.pre("deleteOne", preventQueryModification);
ledgerSchema.pre("deleteMany", preventQueryModification);
ledgerSchema.pre("findOneAndDelete", preventQueryModification);


const Ledger= mongoose.model("Ledger",ledgerSchema);

module.exports=Ledger;