const User = require('../model/schema/userSchema')

module.exports.usersView = async (req,res)=>{
  const user = await User.find({})
    try {
        res.render('admin/adminUsers',{user})
      } catch (error) {
        res.status(500).send(error);
      }
}
