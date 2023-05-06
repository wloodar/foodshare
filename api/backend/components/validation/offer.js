const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateNewSharing(data) {
    
    let errors = {};
    data.ns_name = !isEmpty(data.ns_name) ? data.ns_name : '';
    data.ns_price = !isEmpty(data.ns_price) ? data.ns_price : '';
    data.ns_active_to = !isEmpty(data.ns_active_to) ? data.ns_active_to : '';
    data.ns_description = !isEmpty(data.ns_description) ? data.ns_description : '';

    if(!Validator.isLength(data.ns_name, {min: 3, max: 64})) {
        errors.ns_name = 'Nazwa musi składać się z 3 do 64 znaków';
    }

    if(Validator.isEmpty(data.ns_name)) {
        errors.ns_name = 'Proszę wprowadź nazwę';
    }

    if(Validator.isEmpty(data.ns_active_to)) {
        errors.ns_active_to = 'Proszę podaj godzinę zakoćzenia';
    }

    if(!Validator.isLength(data.ns_description, {max: 250})) {
        errors.ns_description = 'Opis musi zawierać do 250 znaków';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}