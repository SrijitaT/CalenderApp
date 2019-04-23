const mongoose=require("mongoose");
const uri=require("./config/keys").mongoURI;
mongoose
  .connect(
    uri,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Mongodb connected!"))
  .catch(err => console.log(err));