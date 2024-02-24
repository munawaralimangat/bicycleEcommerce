const jwt = require('jsonwebtoken')
const Admin = require('../model/schema/adminSchema')

const requireAuth = async (req,res,next)=>{

    const token = req.cookies.jwtad;
    if(token){
        jwt.verify(token,process.env.JWTKEY,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/admin')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        console.log("no token ")
        res.redirect('/admin')
    }
}

//check if admin
const checkAdmin = async (req,res,next)=>{
    const token = await req.cookies.jwtad;

    if(token){
        jwt.verify(token,process.env.JWTKEY,async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null
                next()
            }else{
                // console.log(decodedToken)
                let admin = await Admin.findById(decodedToken.id);
                res.locals.user = admin;
                console.log("this is admin",admin)
                next()
            }
        })
    }
    else{
        res.locals.user = null
        console.log('admin not logged')
        next()
    }
}

module.exports = {requireAuth,checkAdmin}