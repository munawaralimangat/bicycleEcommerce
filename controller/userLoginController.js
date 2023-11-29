const mongoose = require('mongoose')
const User = require('../model/schema/userSchema')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


const handleErrors = (err)=>{
    console.log(err.message,err.code);
    let errors = {
        user_firstName:"",
        user_secondName:"",
        user_email:"",
        user_number:"",
        user_password:"",
        error:""
    }
    //incorrect email
    if(err.message === 'Incorrect email'){
        errors.error = 'That email is not registered'
    }

    if(err.message === 'Incorrect password'){
        errors.error = 'Incorrect password'
    }

    if(err.message === 'User access is disabled'){
        errors.error = 'User blocked'
    }


    //duplicate errors
    if(err.code===11000){
        errors.user_email = 'That email is already registered';
        return errors;
    }

    //validation errors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    return errors;
}


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id},'mwrmwr',{
        expiresIn:maxAge
    })
}

module.exports.landingView = async (req,res)=>{
    res.render('user/userHome',{
                regLog: "Log In",
                formurl: "login"
            })
}

////////////////////////////////////////////////////////////////////////

module.exports.userRegView = async (req,res)=>{
    res.render('user/userReg', {
                regLog: "Log In",
                formurl: "login",
                errors: ""
            })
}

module.exports.userRegPost = async (req,res)=>{
    const { 
        firstName,
        secondName,
        email,
        number,
        password} = req.body
        console.log('reqbody', req.body)
    try {
        const user = await User.create({
            user_firstName:firstName,
            user_secondName:secondName,
            user_email:email,
            // user_number:number,
            user_password:password,
        })
        const token = createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge * 1000 })
            res.status(201).send({user:user._id})
        
    } catch (err) {
         const errors = handleErrors(err)
         res.status(400).json({errors})
    }
}

module.exports.userLoginView = async (req, res) => {
    const jwtCookie = req.cookies.jwtus;

    if (!jwtCookie) {
        res.render('user/userLogin', {
            regLog: "Register",
            formurl: "register",
            errors: ""
        });
        return;
    }

    try {
        const decodedToken = jwt.verify(jwtCookie, 'mwrmwr');
        res.redirect('/brepublic/landing');
    } catch (error) {
        console.log(error);
        res.render('user/userLogin', {
            regLog: "Register",
            formurl: "register",
            errors: ""
        });
    }
};


module.exports.userLoginPost =async (req,res)=>{
    const {email,password} = req.body;
    console.log(req.body)

    try{
        const user = await User.login(email,password)

        // Check if user_access is false in the database
        if (!user.user_access) {
            const error = new Error('User access is disabled');
            error.status = 400;
            throw error;
        }

        const token = createToken(user._id)
        res.cookie('jwtus',token,{httpOnly:true, maxAge:maxAge * 1000 })
        res.status(200).json({user:user._id})

    }catch(err){
        const errors = handleErrors(err)
        console.log(errors)
        res.status(400).json({errors})
    }
}

///////////////////////////////////////////////////////////////////////////////////

module.exports.userHomeView = async (req,res)=>{
    res.render('user/userHome')
}

module.exports.logout =(req,res)=>{
    console.log("logout")
    res.cookie('jwtus', '',{maxAge:1})
    res.redirect('/brepublic/landing/login')
}
































// const userLandingView = async (req, res) => {
//     res.render('user/landing', {
//         regLog: "Log In",
//         formurl: "login"
//     })
// }

// const userRegView = async (req, res) => {
//     res.render('user/userReg', {
//         regLog: "Log In",
//         formurl: "login",
//         errors: ""
//     })
// }

// const userRegPost = async (req, res) => {
//     console.log(req.body)
//     try {
//         const { user_firstName, user_secondName, user_email, user_number, user_password, confirm_password } = req.body;
//         if (!(user_firstName && user_secondName && user_email && user_number && user_password && confirm_password)) {
//             let error = 'all fields are required'
//             res.status(400).render('user/userReg', {
//                 regLog: "Log In",
//                 formurl: "login",
//                 errors: error
//             })
//             return false
//         }
//         // Check if the password and confirm password match
//         if (user_password !== confirm_password) {
//             let error = 'confirm password'
//             res.status(400).render('user/userReg', {
//                 regLog: "Log In",
//                 formurl: "login",
//                 errors: error
//             })
//             return false
//         }
//         //check if user already exists
//         const existingUser = await User.findOne({ user_email })
//         if (existingUser) {
//             let error = 'user already exists with that email'
//             res.status(400).render('user/userReg', {
//                 regLog: "Log In",
//                 formurl: "login",
//                 errors: error
//             })
//             return false
//         }
//         //encrypt password
//         const encryptedPassword = await bcryptjs.hash(user_password, 10)
//         //save user in db
//         const user = await User.create({
//             user_firstName,
//             user_secondName,
//             user_email,
//             user_number,
//             user_password: encryptedPassword
//         })
//         //generate a token for user
//         const token = jwt.sign(
//             { id: user._id, user_email },
//             'shhhh',
//             {
//                 expiresIn: '1h'
//             }
//         )
//         user.token = token
//         user.user_password = undefined
//         console.log(token)

//         res.status(201).render('user/userLogin', {
//             formurl: "register",
//             regLog: "Register",
//             errors: ""
//         })
//         console.log("end")
//     } catch (error) {
//         console.log(error)
//     }
// };



// const userLoginView = async (req, res) => {
//     res.render('user/userLogin', {
//         regLog: "Register",
//         formurl: "register",
//         errors: ""
//     })
// }


// const userLoginPost = async (req, res) => {
//     try {
//         // Get user_email and user_password from the request body
//         const { user_email, user_password } = req.body;

//         // Validate if both user_email and user_password are provided
//         if (!(user_email && user_password)) {
//             console.log(user_email, user_password);
//             return res.status(400).render('user/userLogin', {
//                 regLog: "Register",
//                 formurl: "register",
//                 errors: "Email and password are required"
//             });
//         }

//         // Find the user in the database
//         const user = await User.findOne({ user_email });

//         // If the user is not found, send an error response
//         if (!user) {
//             return res.status(401).render('user/userLogin', {
//                 regLog: "Register",
//                 formurl: "register",
//                 errors: "Invalid email or password"
//             });
//         }

//         // Check if the provided password matches the hashed password in the database
//         const passwordMatches = await bcryptjs.compare(user_password, user.user_password);

//         if (passwordMatches) {
//             // Generate a token
//             const token = jwt.sign(
//                 { id: user._id },
//                 'shhhh',
//                 {
//                     expiresIn: '1h'
//                 }
//             );

//             // Set the token in a cookie
//             const options = {
//                 expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//                 httpOnly: true
//             };
//             res.cookie('token', token, options);

//             // Render the "user/userLogin" page with the token
//             return res.status(200).render('user/userHome', {
//                 regLog: "Register",
//                 formurl: "register",
//                 token: token
//             });
//         } else {
//             // If the password doesn't match, send an error response
//             return res.status(401).render('user/userLogin', {
//                 regLog: "Register",
//                 formurl: "register",
//                 errors: "Invalid email or password"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         // Handle any other errors gracefully
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// const userHomeView = async (req,res) =>{
//     res.render('user/userHome')
// }



// module.exports = { userLandingView, userLoginView, userLoginPost, userRegView, userRegPost,userHomeView}//login
