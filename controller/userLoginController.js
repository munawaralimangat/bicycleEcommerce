const mongoose = require('mongoose')
const User = require('../model/schema/userSchema')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


const userLandingView = async (req, res) => {
    res.render('user/landing', {
        regLog: "Log In",
        formurl: "login"
    })
}

const userRegView = async (req, res) => {
    res.render('user/userReg', {
        regLog: "Log In",
        formurl: "login",
        errors: ""
    })
}

const userRegPost = async (req, res) => {
    console.log(req.body)
    try {
        const { user_firstName, user_secondName, user_email, user_number, user_password, confirm_password } = req.body;
        if (!(user_firstName && user_secondName && user_email && user_number && user_password && confirm_password)) {
            let error = 'all fields are required'
            res.status(400).render('user/userReg', {
                regLog: "Log In",
                formurl: "login",
                errors: ""
            })
            return false
        }
        // Check if the password and confirm password match
        if (user_password !== confirm_password) {
            let error = 'confirm password'
            res.status(400).render('user/userReg', {
                regLog: "Log In",
                formurl: "login",
                errors: ""
            })
            return false
        }
        //check if user already exists
        const existingUser = await User.findOne({ user_email })
        if (existingUser) {
            let error = 'user already exists with that email'
            res.status(400).render('user/userReg', {
                regLog: "Log In",
                formurl: "login",
                errors: ""
            })
            return false
        }
        //encrypt password
        const encryptedPassword = await bcryptjs.hash(user_password, 10)
        //save user in db
        const user = await User.create({
            user_firstName,
            user_secondName,
            user_email,
            user_number,
            user_password: encryptedPassword,
            confirm_password: encryptedPassword
        })
        //generate a token for user
        const token = jwt.sign(
            { id: user._id, user_email },
            'shhhh',
            {
                expiresIn: '1h'
            }
        )
        user.token = token
        user.user_password = undefined
        console.log(token)

        res.status(201).render('user/userLogin', {
            formurl: "register",
            regLog: "Register",
            errors: ""
        })
        console.log("end")
    } catch (error) {
        console.log(error)
    }
};



const userLoginView = async (req, res) => {
    res.render('user/userLogin', {
        regLog: "Register",
        formurl: "register",
        errors: ""
    })
}


const userLoginPost = async (req, res) => {
    try {
        //get all data from 
        const {user_email,user_password} = req.body
        //validation
        if(!(user_email&&user_password)){
            let error = 'email and password required'
            res.status(400).render('user/userLogin',{
            regLog: "Register",
            formurl: "register"
            })
        }
        //find user in DB
        const user = await findOne({email})
        //if user is not there

        //match the password
        if(user && (await bcryptjs.compare(user_password,user.user_password))){
            const token = jwt.sign(
                {id:user._id},
                'shhhh',
            {
                expiresIn: '1h'
            }
            )
            user.token = token
            user.user_password = undefined
            //cookie section
            const options = {
                expires: new Date(Date.now( + 3 * 24 * 60 * 60 * 1000)),
                httpOnly:true
            }
            res.status(201).json(user)
        }
        //send a token
        res.render('user/userLogin', {
        regLog: "Register",
        formurl: "register"
        })
    } catch (error) {
        console.log(error)
    }

}


module.exports = { userLandingView, userLoginView, userLoginPost, userRegView, userRegPost }//login
