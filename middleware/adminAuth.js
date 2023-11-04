const jwt = require('jsonwebtoken')
const Admin = require('../model/schema/adminSchema')

const requireAuth = async (req,res,next)=>{

    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'mwrmwr',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/admin/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        console.log("no token ")
        res.redirect('/admin/login')
    }
}

//check current user
const checkAdmin = async (req,res,next)=>{
    const token = await req.cookies.jwt;

    if(token){
        jwt.verify(token,'mwrmwr',async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null
                next()
            }else{
                // console.log(decodedToken)
                let admin = await Admin.findById(decodedToken.id);
                res.locals.user = admin;
                console.log("oyoyoyyooy",admin)
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

module.exports = {requireAuth,checkAdmin}