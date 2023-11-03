const jwt = require('jsonwebtoken')

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

    }else{

    }
}


module.exports = {requireAuth}