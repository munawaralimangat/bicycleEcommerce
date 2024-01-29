const mongoose = require('mongoose');
const mailSender = require('../../utils/mailSender')

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5
    }
});

//function for send a mail

async function sendVerificationEmail(email,otp){
    try {
        const mailresponse = await mailSender(
            email,
            "Verification email",
            `<h1> Please confirm your OTP</h1>
            <h1> here is your ${otp}</h1>`
        );
        console.log("Email sent: ",mailresponse)
    } catch (error) {
        console.error("Error occured sending email",error);
        throw error
    }   
}
otpSchema.pre("save", async function (next) {
    console.log("New document saved to the database");
    if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
    }
    next();
  });

  module.exports = mongoose.model("OTP", otpSchema);