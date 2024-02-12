const otpGenerator = require('otp-generator');
const OTP = require('../model/schema/otpSchema');
const User = require('../model/schema/userSchema');

exports.sendOTP = async (req,res)=>{
    try {
        console.log(req.body)
        const {email} = req.body;
        console.log(email)
        // const checkUserPresent = await User.findOne({user_email:email})
        // console.log(checkUserPresent)
        // if(checkUserPresent){
        //     return res.status(401).json({success:false,message:"User already registered"});
        // }
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

module.exports.verifyOtp = async (req,res)=>{
    try {
        const otp = req.body.otp
        const otpDocument = await OTP.findOne({otp})
        if(!otpDocument){
            return res.status(400).json({message:'Invalid OTP'})
        }
        const currentTime = new Date();
        if (otpDocument.createdAt + otpDocument.expires * 1000 < currentTime) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        console.log(otpDocument.email)
        const user = await User.findOne({ user_email: otpDocument.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        return res.status(200).json({ message: 'OTP verification successful.', userId: user._id });
    } catch (error) {
        console.error(error)
    }
}