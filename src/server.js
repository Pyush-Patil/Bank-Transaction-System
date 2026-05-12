require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const express = require("express");
const ConnectDB=require("./config/db")
const cookieparser=require("cookie-parser")


const app=express();
app.use(express.json());
app.use(cookieparser());

// Routes Required
const authRouter=require("./routes/auth.routes")
const accountRouter=require("./routes/account.routes");
const transactionRouter=require("./routes/transaction.routes")

//Using routes
app.use("/api/auth",authRouter);
app.use("/api/account",accountRouter);
app.use("/api/transactions",transactionRouter);


async function startServer() {
    try {
        await ConnectDB();
        app.listen(3000,()=>{
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.error("Failed to start server:", err.message || err);
        process.exit(1);
    }
}

startServer();