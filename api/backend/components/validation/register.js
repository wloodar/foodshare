const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    // data.register_type = !isEmpty(data.register_type) ? data.register_type : 0;
    data.first_name = !isEmpty(data.first_name) ? data.first_name : ''
    data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
    // data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_repeated = !isEmpty(data.password_repeated) ? data.password_repeated : '';

    if(data.register_type != 1 && data.register_type != 2) {
        console.log('yes');
        
        errors.register_type = 'Wystąpił nieoczekiwany błąd podczas rejestracji.';
    }

    if(!Validator.isLength(data.first_name, { max: 32 })) {
        errors.first_name = 'Proszę podaj prawidłowe imię';
    }

    if(Validator.isEmpty(data.first_name)) {
        errors.first_name = 'Proszę podaj swoje imię';
    }

    if(!Validator.isLength(data.last_name, { max: 32 })) {
        errors.last_name = 'Proszę podaj prawidłowe nazwisko';
    }

    if(Validator.isEmpty(data.last_name)) {
        errors.last_name = 'Proszę podaj swoje nazwisko';
    }

    // if(!data.phone_number.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/)) {
    //     errors.phone_number = "Proszę podaj prawidłowy numer telefonu."
    // }

    // if(Validator.isEmpty(data.phone_number)) {
    //     errors.phone_number = 'Proszę podaj swój numer telefonu';
    // }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Proszę podaj poprawny adres email';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Proszę podaj swój adres email';
    }

    if (!containsUppercaseLetter(data.password)) {
        errors.password = 'Hasło musi zawierać przynajmniej jedną wielką literę'
    }

    if(!Validator.isLength(data.password, {min: 6, max: 32})) {
        errors.password = 'Hasło musi składać się z 6 do 32 znaków';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Proszę podaj swoje hasło';
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