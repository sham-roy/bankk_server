// library used to connect mongodb
const mongoose =require("mongoose")

// connection string creation 
mongoose.connect("mongodb://localhost:27017/bankServer",{useNewParser:true})

// model creation
const User=mongoose.model("user",
{
            username:String,
            acno:Number, 
            password:String,
            balance:Number, 
            transaction:[] 
    })

module.exports={
    User
}