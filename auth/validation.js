const {check,validationResult} = require('express-validator');

const validateLogin = [
    check('email','Email is required').isEmail().notEmpty(),
    check('password','Password is required').notEmpty()
];

module.exports = {validateLogin,}