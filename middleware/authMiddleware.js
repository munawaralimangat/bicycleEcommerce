const jwt = require('jsonwebtoken')
const User = require('../model/schema/userSchema')

const requireAuth = (req,res,next)=>{

    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'mwrmwr',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/brepublic/landing/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/brepublic/landing/login')
    }
}

//check current user
const checkUser = async (req,res,next)=>{
    const token = await req.cookies.jwt;

    if(token){
        jwt.verify(token,'net ninja secret',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                next()
            }else{
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next()
            }
        })
    }
    else{

    }
}


module.exports = {requireAuth}