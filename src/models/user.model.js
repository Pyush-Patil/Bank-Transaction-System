const mongoose=require("mongoose");
const bcrypt= require("bcryptjs");

const userSchema= new mongoose.Schema({
    name:{
          type:String,
          required:[true,"Name is required"],
          trim:true,
          minlength:[3,"Name must be at least 3 characters long"],
          maxlength:[100,"Name must be at most 100 characters long"]
    },
     email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password must be at least 6 characters long"],
        select:false,
    }
},{timestamps:true});

userSchema.pre("save",async function (next) {
   if(!this.isModified("password"))
   {
    return next();
   }

   const hash= await bcrypt.hash(this.password,10);
   this.password=hash;

   return next();
})

userSchema.methods.comparePassword=async function (password) {

    return await bcrypt.compare(this.password,password);
    
}



const User= mongoose.model("User",userSchema);

module.exports=User;