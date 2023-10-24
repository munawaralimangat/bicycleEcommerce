const userLoginView = async (req,res)=>{
    res.render('user/landing')
}

const userLoginPost = async(req,res)=>{
    res.render('user/userLogin')
}


module.exports = {userLoginView,userLoginPost}