const express = require("express");
const router = express.Router();
const user_controller=require("../../controller/user_controller");

//@route POST api/users/register
//@desc Register User
//@access Public
router.post("/register", user_controller.registerUser);


//@route POST api/users/login
//@desc Login User/Return jwt token
//@access Public
router.post("/login", user_controller.loginUser);


router.get("/",user_controller.getUsers);
module.exports=router;