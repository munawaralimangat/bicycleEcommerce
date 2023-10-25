const userLandingView = async (req,res)=>{
    res.render('user/landing',{
        regLog:"Log In",
        formurl:"login"
    })
}

const userRegView = async (req,res)=>{
    res.render('user/userReg',{
        regLog:"Log In",
        formurl:"login",
        errors:""
    })
}

const userRegPost = async (req, res) => {
    const { username, password, email } = req.body;
  
    // Perform data validation here
  
    // Create a new user document
    const newUser = new User({
      username,
      password, // Remember to hash and salt passwords for security
      email,
    });
  
    // Save the new user to the database
    await newUser.save();
  
    res.redirect('/login'); // Redirect to the login page after successful registration
  };



const userLoginView = async(req,res)=>{
    res.render('user/userLogin',{
        regLog:"Register",
        formurl:"register",
        errors:""
    })
}


const userLoginPost = async(req,res)=>{
    res.render('user/userLogin',{
        regLog:"Register",
        formurl:"register"
    })
}


module.exports = {userLandingView,userLoginView,userLoginPost,userRegView,userRegPost}//login
