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
    const Id = req.params.Id;
    const user = await User.findById(Id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle the user's access status (block if unblocked, unblock if blocked)
    user.user_access = !user.user_access;

    // Save the updated user to the database
    await user.save();

    // Respond with a message indicating the action taken
    const message = user.user_access ? 'User has been blocked successfully' : 'User has been unblocked successfully';
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating the user status' });
  }
}

