const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};
    data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
    data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : '';
    data.email = !isEmpty(data.email) ? data.email : '';

    if(!Validator.isLength(data.first_name, { max: 32 })) {
        errors.first_name = 'Proszę podaj prawidłowe imię';
    }

    if(Validator.isEmpty(data.first_name)) {
        errors.first_name = 'Proszę podaj swoje imię';
    }

    if(!data.phone_number.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/)) {
        errors.phone_number = "Proszę podaj prawidłowy numer telefonu."
    }

    if(Validator.isEmpty(data.phone_number)) {
        errors.phone_number = 'Proszę podaj swój numer telefonu';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Proszę podaj poprawny adres email';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Proszę podaj swój adres email';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}