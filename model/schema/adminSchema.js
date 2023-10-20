const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const adminSchema = new Schema({ 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

adminSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model("admins", adminSchema);
module.exports = Admin;

