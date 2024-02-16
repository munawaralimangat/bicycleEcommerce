const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema({
  user_firstName: {
    type: String,
    required: [true,"please enter first name"]
  },
  user_secondName: {
    type: String,
    required: [true,"please enter second name"]
  },
  user_email: {
    type: String,
    required: [true,"Please enter an email"],
    unique: true,
    lowercase:true,
    validate:[isEmail,"Please enter a valid email"]
  },
  user_access: {
    type: Boolean,
    default:true
  },
  user_mobile: {
    type: String,
    default:null,
    unique:true,
  },
  user_password: {
    type: String,
    required: [true,"Please enter a password"],
    minlength:[6,"minimum password length is 6 charecters"]
  },
});


// userSchema.post('save',function(doc,next){
//   console.log('new user was created',doc) //this will work after data is saved
//   next()
// })

//fire a function before doc saved to db
userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt()
  this.user_password = await bcrypt.hash(this.user_password,salt)
  next()
})

//static method for login user
userSchema.statics.login = async function(user_email, user_password) {
  const user = await this.findOne({user_email});
  console.log("user",user_email)
  if (user) {
    const auth = await bcrypt.compare(user_password, user.user_password); // Compare the provided password with the hashed password in the database
    if (auth) {
      return user;
    }
    console.log(user_password, user.user_password)
    throw new Error('Incorrect password');
  }
  throw new Error('Incorrect email');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
