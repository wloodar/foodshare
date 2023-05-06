const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates-v2').EmailTemplate;
const path = require('path');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');

const validateRegisterInput = require('../components/validation/register');
const validateLoginInput = require('../components/validation/login');
const validatePasswordsResetInputs = require('../components/validation/password/reset-change');
const db = require('../middleware/db');

const uuid = require('uuid');
const CryptoJS = require("crypto-js");
const crypto = require('crypto');
var hmacsha1 = require('hmacsha1');
var createHmac = require('create-hmac')

const cloudinary = require('cloudinary');

exports.auth_login = async (req, res, next) => {

    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid) {
        return res.status(200).json(errors);
    }

    const email = req.body.email.toString();
    const password = req.body.password;

    db.query(`SELECT * FROM usr_users WHERE email = $1`, [email])
    .then(user => {       
        if (user.rowCount == 0) {
            return res.status(200).json({
                login_message: 'Your Email or Password is incorrect.'
            });
        }
        // User exists
        const userData = user.rows[0];
        bcrypt.compare(password, userData.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = {
                            id: userData.id,
                            email: userData.email,
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            phone_number: userData.phone_number,
                            school_id: userData.school_id,
                            preferences: userData.preferences
                        }
                        jwt.sign(payload, process.env.JWT_SECRET, {
                            // expiresIn: 3600
                            expiresIn: 86400
                        }, (err, token) => {
                            if(err) console.error('There is some error in token', err);
                            else {
                                res.status(200).json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        return res.status(200).json({
                            login_message: 'Your Email or Password is incorrect.'
                        });
                    }
                });
    })
    .catch(error => {
        console.log('ERROR:', error);
        return res.status(401).json({
            message: 'Auth failed.'
        });
    });
}

exports.auth_register = (req, res, next) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(200).json(errors);
    }

    db.query(`SELECT * FROM usr_users WHERE email = $1`, [req.body.email])
    .then(user => {
        if (user.rowCount != 0) {
            return res.status(200).json({
                email: 'Użytkownik o takim adresie email już istnieje'
            });
        } else {

            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('Unexpected error: ', err);
                else {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if(err) console.error('Unexpected error: ', err);
                        else {
                            // db.query('INSERT INTO usr_users VALUES (default, $1, $2, $3, null, null, $4, default, null)', [req.body.email, req.body.phone_number, hash, req.body.first_name], function(reg_err, result) {
                            db.query('INSERT INTO usr_users VALUES (default, $1, $2, $3, $4, $5, null, null, null, null, default, default, null, $6)', [req.body.register_type, req.body.email, req.body.first_name, req.body.last_name, hash, '{"theme": ""}'], function(reg_err, result) {
                                if(reg_err) {
                                    return res.status(200).json({
                                        message: 'Unexpected error.'
                                    });
                                } else {
                                    res.status(200).json({
                                        message: 'true'
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }

    });

}

exports.auth_password_reset = (req, res, next) => {

    fetchUserIdByEmail();

    async function fetchUserIdByEmail() {
        const user = await db.query(`SELECT * FROM usr_users WHERE email = $1`, [req.body.email]);
        if (user.rowCount != 0) {
            require('crypto').randomBytes(64, function(err, buffer) {
                const token = buffer.toString('hex');
            
                db.query('UPDATE usr_users SET password_reset_token=$1, password_reset_time=NOW() WHERE id=$2', [token, parseInt(user.rows[0].id)], function(reg_err, result) {
                    console.log(reg_err);
                    if(reg_err) {    
                        return res.status(200).json({
                            message: 'Failed'
                        });
                    } else {


                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                              user: 'torunianin1234@gmail.com',
                              pass: ''
                            }
                        });

                        const mail_user = [{ 
                            first_name:  user.rows[0].first_name,
                            email:       user.rows[0].email,
                            reset_token: 'http://localhost:3000/reset-password-change/' + token + '?ead=' + user.rows[0].email
                        }]

                        function sendEmail (obj) {
                            return transporter.sendMail(obj);
                        }

                        function loadTemplate (templateName, contexts) {
                            let template = new EmailTemplate(path.join(__dirname, '../components/mail/templates', templateName));
                            return Promise.all(contexts.map((context) => {
                                return new Promise((resolve, reject) => {
                                    template.render(context, (err, result) => {
                                        if (err) reject(err);
                                        else resolve({
                                            email: result,
                                            context,
                                        });
                                    });
                                });
                            }));
                        }

                        loadTemplate('passwordreset', mail_user).then((results) => {
                            return Promise.all(results.map((result) => {
                                sendEmail({
                                    to: result.context.email,
                                    from: '"OurWorkspace" <noreply@ourworkspace.com>',
                                    subject: result.email.subject,
                                    html: result.email.html,
                                });
                            }));
                        });

                        res.status(200).json({
                            message: 'success'
                        })
                    }
                });
            });
        } else {
            return res.status(200).json({
                message: 'Failed'
            });
        }
    }
}

exports.auth_password_reset_validate_token = (req, res, next) => {
    doAction();

    async function doAction() {
        const result = await checkToken(req.body.email, req.body.token);

        res.status(200).json({
            message: result
        });
    }
}

exports.auth_password_reset_change_password = (req, res, next) => {
    mainLogic();

    async function mainLogic() {
        const result = await checkToken(req.body.email, req.body.token);

        if (result !== 'success') {
            res.status(200).json({
                message: result
            });
        } else {
            const { errors, isValid } = validatePasswordsResetInputs(req.body);
            if(!isValid) {
                return res.status(200).json(errors);
            }

            const newPassword = req.body.password;

            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('Unexpected error: ', err);
                else {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if(err) console.error('Unexpected error: ', err);
                        else {
                            db.query('UPDATE usr_users SET password=$1, password_reset_token=null, password_reset_time=null WHERE email=$2', [hash, req.body.email], function(reg_err, result) {
                                if(reg_err) {
                                    return res.status(200).json({
                                        message: 'Unexpected error.'
                                    });
                                } else {
                                    res.status(200).json({
                                        message: 'true'
                                    })
                                }
                            });
                        }
                    });
                }
            });

        }
    }
}

exports.getSchoolDetails = (req, res, next) => {
    axios.get('https://rspo.men.gov.pl/?rspo_search_criteria%5Bregon%5D=000187547')
    .then((response) => {
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            
            const divContent = $('.col-lg-offset-1').text();

            res.status(200).json({
                divContent: divContent
            })
        }
    })
    .catch((err) => {
        throw new Error(err);
    });
}


exports.uploadAuth = (req, res, next) => {

    // const random_string = uuid.v4();
    // const expire = (Math.floor(new Date() / 1000) + 60);
    // const signature = CryptoJS.HmacSHA1(random_string+expire, "private_1BLWoghdyeUIOgMUwRR1dHGWTIA=");

    // res.status(200).json({
    //     token: random_string,
    //     expire: expire,
    //     signature: signature.toString(CryptoJS.enc.Hex)
    // });
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request({ timestamp }, "MTAbr6xKs6Qr-0ePVk_hFE5IFsk");

     res.status(200).json({
        signature: signature
    });

}

async function checkToken (email_address, t_token) {
    const user = await db.query('SELECT password_reset_token, password_reset_time FROM usr_users WHERE email=$1', [email_address]);

    if (user.rowCount == 0) {
        return 'failed';
    } else {
        if (user.rows[0].password_reset_token == t_token) {
            if (user.rows[0].password_reset_time.addHours(1).getTime() > Date.now()) {
                return 'success';
            } else {
                return 'expired';
            }
        } else {
            return 'failed';
        }
    }
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}






























// async function checkToken (res, email_address, t_token) {
//     const user = await db.query('SELECT password_reset_token, password_reset_time FROM usr_users WHERE email=$1', [email_address]);

//     if (user.rowCount == 0) {
//         res.status(200).json({
//             message: 'failed'
//         });
//     } else {
//         if (user.rows[0].password_reset_token == t_token) {
//             if (user.rows[0].password_reset_time.addHours(0).getTime() > Date.now()) {
//                 return true;
//             } else {
//                 res.status(200).json({
//                     message: 'expired'
//                 });
//             }
//         } else {
//             res.status(200).json({
//                 message: 'failed'
//             });
//         }
//     }
// }





// var mailOptions = {
                        //     from: '"OurWorkspace" <noreply@ourworkspace.com>', // sender address
                        //     to: 'wlodardev@gmail.com', // list of receivers
                        //     subject: 'Our Workspace - Password Reset', // Subject line
                        //     // html:
                        // }

                        // transporter.sendMail(mailOptions, function(error, info){
                        //     if (error) {
                        //       console.log(error);
                        //     } else {
                        //       console.log('Email sent: ' + info.response);
                        //     }
                        // });


                        