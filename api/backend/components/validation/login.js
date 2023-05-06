const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Proszę podaj swój adres email';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Proszę podaj swoje hasło';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}