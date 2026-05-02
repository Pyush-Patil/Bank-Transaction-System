const mongoose=require("mongoose");

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message || err);
        throw err;
    }
}

module.exports=ConnectDB;