const otpGenerator = require('otp-generator');
const OTP = require('../model/schema/otpSchema');
const User = require('../model/schema/userSchema');

exports.sendOTP = async (req,res)=>{
    try {
        console.log(req.body)
        const {email} = req.body;
        console.log(email)
        const checkUserPresent = await User.findOne({email})
        if(checkUserPresent){
            return res.status(401).json({success:false,message:"User already registered"});
        }
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false
            });
            result = await OTP.findOne({otp:otp})
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp,
          });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}