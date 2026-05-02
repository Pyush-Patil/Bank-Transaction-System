const express=require("express");
const authController=require("../controllers/auth.controllers")

const router=express.Router();

//POST => /api/auth/register
router.post("/register",authController.userRegistercontroller)

router.post("/login",authController.userLogincontroller)

module.exports=router;