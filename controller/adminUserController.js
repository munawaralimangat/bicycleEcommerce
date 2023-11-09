const User = require('../model/schema/userSchema')

module.exports.usersView = async (req,res)=>{
    const user = await User.find()
    try {
        res.render('admin/adminUsers',{users:user})
      } catch (error){
        res.status(500).json({error:"error fetching users"});
      }
}

module.exports.userBlock = async (req, res) => {
  try {
    const userId = req.params.Id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newAccessStatus = !user.user_access;

    const updateResult = await User.updateOne({ _id: userId }, { $set: { user_access: newAccessStatus } });

    if (updateResult.nModified === 1) {
      // Update was successful
      const message = newAccessStatus ? 'User has been blocked successfully' : 'User has been unblocked successfully';
      res.status(200).json({ message });
    } else {
      res.status(200).json({ message: 'User status remains unchanged' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating the user status' });
  }
}


