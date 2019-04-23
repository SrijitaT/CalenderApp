const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const keys = require("../config/keys");


const registerUser=async (req, res) => {
    /* const { errors, isValid } = validateRegisterInput(req.body);
     //Check validation
     if (!isValid) {
       return res.status(400).json(errors);
     }*/
     const errors={};
     const user=await User.findOne({ email: req.body.email });
        if (user) {
           errors.email = "Email already exists!";
           return res.status(400).json(errors);
         } 
         else {
             const newUser = new User({
                 firstname: req.body.firstname,
                 lastname: req.body.lastname,
                 username: req.body.username,
                 email: req.body.email,
                 password: req.body.password
               });
             try{
               const saveUser= await newUser.save();
               if(saveUser){
                res.json(saveUser);
               }
              }
              catch(err){
                console.log(err);
              }
         }
    
    }

const loginUser=async (req, res) => {
  const {email,password} = req.body;
  /*const { errors, isValid } = validateLoginInput(req.body);
  //Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }*/
  //Find the user by email
  const errors={};
     try{
       var current_user=await User.findOne({ email});
         if (!current_user) {
            errors.email = "User not found!";
            return res.status(404).json(errors);
          }
      }
      catch(err){
          console.log(err);
      }

      //Check password
      const isMatch=await current_user.isValidPassword(password);
          if (isMatch) {
            //User Matched
            const payload = {
              id: current_user.id,
              username: current_user.username
            }; //Create JWT payload

            //Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            errors.password = "Password incorrect!";
            return res.status(400).json(errors);
          }
      
}

const getUsers=async (req,res)=>{
  try
  {
    const user=await User.find();
    if(user)
    {
      const usersList=user.map(u=>{return {"_id":u.id,"username":u.username,"email":u.email}});
      return res.status(200).json(usersList);
    }
    else
    {
      return res.status(400).json({"msg":"No data found!"});
    }
 }
  catch(err){
    return res.status(400).json({"msg":"Oops database error!!"});
  }
}


module.exports={registerUser,loginUser,getUsers};