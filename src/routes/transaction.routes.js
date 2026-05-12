const express=require("express");
const authmiddleware=require("../middleware/auth.middleware");
const router=express.Router();
const transactionController=require("../controllers/transaction.controller")

//POST /api/transactions => creates a new transactions

router.post("/",authmiddleware.authMiddleware,transactionController.createTransaction);

//POST -> /api/transactions/system/initial-funds
router.post("/system/initial-funds",authmiddleware.systemAuthMiddleware,transactionController.createInitialfundsTransaction);



module.exports=router;