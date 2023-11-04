const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator')

const adminSchema = new mongoose.Schema({ 
    email: {
        type: String,
        required: [true,"Please enter an email"],
        validate:[isEmail,"Please enter a valid email"],
        unique: true,
        lowercase:true,
    },
    password: {
        type: String,
        required: [true,"Please enter a password"],
        minlength:[6,"minimum password length is 6 charecters"]
        
    }
});

adminSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
  })



  //static method for login admin
adminSchema.statics.login = async function(email, password) {
    const admin = await this.findOne({ email });
    console.log(email)
    if (admin) {
      const auth = await bcrypt.compare(password, admin.password); // Compare the provided password with the hashed password in the database
      if (auth) {
        return admin;
      }
      throw new Error('Incorrect password');
    }
    throw new Error('Incorrect email');
  };

// adminSchema.methods.comparePassword = function(candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);
// };

const Admin = mongoose.model("admins", adminSchema);
module.exports = Admin;

