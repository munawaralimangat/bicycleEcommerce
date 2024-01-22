const User = require('../model/schema/userSchema')

module.exports.viewProfile = async (req,res)=>{
    console.log("this works")
    try {
        const userId = req.query.userId;
        if(!userId){
            return res.redirect('/brepublic/landing/login')
        }

        res.render('user/userProfile',{})
    } catch (error) {
        console.error(error)
    }
}

module.exports.getUserData = async (req,res)=>{
    try {
        const userId = req.params.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.json(user)
    } catch (error) {
        console.error("Error fetching user data",error);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports.updateUser = async (req,res)=>{
    try {
        const userId = req.params.userId;
        const {firstName,secondName,mobile,email} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.user_firstName = firstName || user.user_firstName;
        user.user_secondName = secondName || user.user_secondName;
        user.user_mobile = mobile || user.user_mobile;
        user.user_email = email || user.user_email;

        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}