const protectRoute = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    console.log("please log in to continue")
    res.redirect('/admin/login')
}
const allowif = ()=>{
    if(!req.isAuthenticated()){
        return next()
    }
    res.redirect('/admin/dashboard')
}
module.exports = {
    protectRoute,
    allowif,
}