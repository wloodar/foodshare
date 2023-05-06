const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validatePasswordsResetInputs(data) {
    
    let errors = {};
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirmed = !isEmpty(data.password_confirmed) ? data.password_confirmed : '';

    if (!containsUppercaseLetter(data.password)) {
        errors.new_password = 'Password must contain at least one capital letter'
    }

    if(!Validator.isLength(data.password, {min: 6, max: 32})) {
        errors.new_password = 'Password must be between 6 and 32 characters';
    }

    if(Validator.isEmpty(data.password)) {
        errors.new_password = 'Please enter your password';
    }

    if (data.password !== data.password_confirmed) {
        errors.confirm_new_password = 'Confirmed password not match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

containsUppercaseLetter = (str) => {
    for (var i=0; i < str.length; i++) {
        if (str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
            return true;
        } else if ((i + 1) == str.length) {
            return false;
        }
    }
}