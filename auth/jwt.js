const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../model/schema/adminSchema');
const secretKey = "kakakiki"

const authenticate = async (email,password)=>{
  try {
    const admin = await Admin.findOne({email}).exec()
    if(!admin){
      return {success: false, message:"Authentication failed, Invalid userName"}
    }

    const isPasswordValid = await admin.comparePassword(password)

    if(!isPasswordValid){
      return { success: false, message: 'Authentication failed. Invalid password' };
    }
    const token = jwt.sign({adminId:admin._id},secretKey,{ expiresIn: '1h' })
    return {success:true, token}
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal Server Error' };
  }
}

module.exports = {authenticate};
