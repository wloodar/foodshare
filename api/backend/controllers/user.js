const db = require('../middleware/db');
const jwt = require('jsonwebtoken');

const validateUserCredentialsUpdate = require('../components/validation/updateUser');

exports.get_currentuser_genereal_info = (req, res, next) => {

    const currentId = req.userData.id;
    getUserInfo(currentId);

    async function getUserInfo(usr_id) {

        const db_result = await db.query('SELECT first_name, last_name, phone_number, email, school_id, ap_sh.school_name as school_name, ap_sh.city_name as school_city, ap_sh.street_name as school_street FROM usr_users LEFT JOIN ap_schools ap_sh ON ap_sh.id=school_id WHERE usr_users.id=$1', [usr_id]);
        if (db_result.rowCount > 0) {
            res.status(200).json(db_result.rows[0])
        } else {
            res.status(200).json({ message: false });
        }
    }

}


exports.school_update = (req, res, next) => {

    checkIfUserHasActiveOffers().then(result => {
        if (result) {
            res.status(200).json({
                error: true,
                message: "Przed zmianą szkoły musisz zakończyć swoje dotychczasowe oferty podzielenia się."
            });
        } else {
            
            if (db.query('UPDATE usr_users SET school_id=$1 WHERE id=$2', [req.body.school_id, req.userData.id])) {

                const payload = {
                    id: req.userData.id,
                    email: req.userData.email,
                    first_name: req.userData.first_name,
                    last_name: req.userData.last_name,
                    phone_number: req.userData.phone_number,
                    school_id: req.body.school_id,
                    preferences: req.userData.preferences
                }
                jwt.sign(payload, process.env.JWT_SECRET, {
                    // expiresIn: 3600
                    expiresIn: 86400
                }, (err, token) => {
                    if(err) console.error('There is some error in token', err);
                    else {
                        res.status(200).json({
                            message: true,
                            token: `Bearer ${token}`
                        });
                    }
                });
            } else {
                res.status(200).json({
                    message: false
                }); 
            }
        }
    });



    async function checkIfUserHasActiveOffers() {
        try {
            const db_res = await db.query('SELECT id FROM ap_shares WHERE shared_by=$1 AND school_id=$2 AND deleted_at is NULL AND picked_up_at is NULL', [req.userData.id, req.userData.school_id]);
            if (db_res.rowCount > 0) {
                return true;
            } else {
                return false;
            }

        } catch(err) {
            console.log(err);
            res.status(200).json({
                error: true,
                message: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie, jeżeli o to ten błąd się powtarza, wyślij do nas wiadomość na https://foodshare.p;/help/error-report i w treścic napisz: oferta_10"
            });
        }
    }
}

exports.get_user_received_offers = (req, res, next) => {
    const currentId = req.userData.id;
    getOffers(currentId);

    async function getOffers(usr_id) {
        const db_result = await db.query('SELECT * FROM ap_shares WHERE shared_by!=$1 AND picked_up_at=$1', [usr_id]);
        res.status(200).json({
            offers: db_result.rows
        })
    }
}


exports.updateUserCredentials = (req, res, next) => {

    const { errors, isValid } = validateUserCredentialsUpdate(req.body);
    if(!isValid) {
        return res.status(200).json(errors);
    }

    const { first_name } = req.body;
    const { phone_number } = req.body;
    const { email } = req.body;
     
    db.query('SELECT first_name, phone_number, email FROM usr_users WHERE id=$1', [req.userData.id])
        .then(result => {
            const user = result.rows[0];
            if (user.email != email || user.phone_number != phone_number) {
                if (user.email != email && user.phone_number != phone_number) {
                    // updateUser();
                }
            } else {
                if (db.query('UPDATE usr_users SET first_name=$1 WHERE id=$2', [first_name, req.userData.id])) {
                    const payload = {
                        id: req.userData.id,
                        email: req.userData.email,
                        first_name: first_name,
                        phone_number: req.userData.phone_number,
                        school_id: req.userData.school_id
                    }
                    jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: 86400
                    }, (err, token) => {
                        if(err) console.error('There is some error in token', err);
                        else {
                            res.status(200).json({
                                message: true,
                                token: `Bearer ${token}`
                            });
                        }
                    });
                } else {
                    res.status(200).json({
                        message: false
                    }); 
                }
            }
        });

        function updateUser(em, phn) {

        }
    // if (checkIfRepeated) {
    //     return res.status(200).json({
    //         email: 'Użytkownik o takim adresie email albo numerze telefonu już istnieje'
    //     });
    // } else {


    //     // if (db.query('UPDATE usr_users SET first_name=$1, phone_number=$2, email=$3 WHERE id=$4', [first_name, phone_number, email, req.userData.id])) {
    //     //     const payload = {
    //     //         id: req.userData.id,
    //     //         email: email,
    //     //         first_name: first_name,
    //     //         phone_number: phone_number,
    //     //         school_id: req.userData.school_id
    //     //     }
    //     //     jwt.sign(payload, process.env.JWT_SECRET, {
    //     //         expiresIn: 86400
    //     //     }, (err, token) => {
    //     //         if(err) console.error('There is some error in token', err);
    //     //         else {
    //     //             res.status(200).json({
    //     //                 message: true,
    //     //                 token: `Bearer ${token}`
    //     //             });
    //     //         }
    //     //     });
    //     // } else {
    //     //     res.status(200).json({
    //     //         message: false
    //     //     }); 
    //     // }
    // }

    // async function checkIfRepeated() {
    //     const user = await db.query(`SELECT id FROM usr_users WHERE email = $1 OR phone_number = $2`, [email, phone_number]);
    //     if (user.rowCount != 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }   
}