require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const express = require("express");
const ConnectDB=require("./config/db")
const authRouter=require("./routes/auth.routes")
const cookieparser=require("cookie-parser")

const app=express();
app.use(express.json());
app.use(cookieparser());


app.use("/api/auth",authRouter);

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