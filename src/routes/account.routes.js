const express=require("express");
const authmiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controllers");

const router=express.Router();

router.post("/",authmiddleware.authMiddleware,accountController.createAccountController);

router.get("/",authmiddleware.authMiddleware,accountController.getallAccounts);


module.exports=router;