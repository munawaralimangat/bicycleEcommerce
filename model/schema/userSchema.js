const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  user_firstName: {
    type: String,
    required: true
  },
  user_secondName: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  user_number: {
    type: Number,
    required: true
  },
  user_password: {
    type: String,
    required: true
  },
  token:{
    type:String,
    default:null
  }
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcryptjs.compare(candidatePassword, this.user_password);
}
const User = mongoose.model('User', userSchema);

module.exports = User;
