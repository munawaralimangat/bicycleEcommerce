const jwt = require('jsonwebtoken')
const User = require('../model/schema/userSchema')

const requireAuth = async (req,res,next)=>{

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
        console.log("no token ")
        res.redirect('/brepublic/landing/login')
    }
}

//check current user
const checkUser = async (req,res,next)=>{
    const token = await req.cookies.jwt;

    if(token){
        jwt.verify(token,'mwrmwr',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null
                next()
            }else{
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                console.log(user.user_email)
                next()
            }
        })
    }
    else{
        res.locals.user = null
        console.log('user not logged')
        next()
    }
}


module.exports = {requireAuth,checkUser}