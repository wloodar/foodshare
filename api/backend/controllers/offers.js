const db = require('../middleware/db');
const validateNewShare = require('../components/validation/offer');
const cloudinary = require('cloudinary').v2;
const randomstring = require("randomstring");
const moment = require("moment");

cloudinary.config({ 
    cloud_name: 'dgzvc6fls', 
    api_key: '955379124996356', 
    api_secret: 'MTAbr6xKs6Qr-0ePVk_hFE5IFsk' 
  });

exports.addNewOffer = (req, res, next) => {
    
    checkIfUserPostedInOtherSchoolPromise().then(result => {
        if (result) {
            res.status(200).json({
                success: false,
                message: "Posiadasz już aktywne oferty w innej szkole. Przed podzieleniem się w innej szkole musisz najpierw zakończyć oferty w aktualnej szkole."
            });
        } else {
            
            const { errors, isValid } = validateNewShare(req.body);
            if(!isValid) {
                return res.status(200).json(errors);
            }

            const sh_school_id = req.body.school_id;
            const sh_ns_name = req.body.ns_name;
            const sh_ns_price = req.body.ns_price;
            const sh_ns_active_to = req.body.ns_active_to;
            const sh_ns_description = req.body.ns_description;
            // console.log(req.files.photo);
    
            // req.files.photo.tempFilePath
            cloudinary.uploader.upload(req.files.photo.tempFilePath, { 
                folder: "foodshare/shares",
                transformation: [
                    {width: 600, crop: "scale"},
                    {quality: "auto:eco", fetch_format: "auto"}
                ]
                }, function (err, image) {
                    console.log(err);
                    
                    if (err) { res.status(200).json({error: true}); }
                    else {
                        const image_id = image.public_id;
                        db.query('INSERT INTO ap_shares VALUES (default, $1, $2, NOW(), $3, $4, $5, default, null, $6, null, null, null, null, null)', [sh_ns_name, sh_ns_price, image.public_id, req.userData.id, sh_school_id, sh_ns_description], function(reg_err, result) {
                            console.log(reg_err);
                            
                            if (!reg_err) {
                                console.log("New offer has been created.");
                                res.status(200).json({success: true});
                            } else {
                                cloudinary.uploader.destroy(image.public_id, function(result) { console.log(result) });
                                res.status(200).json({error: true});
                            }
                        });
                    }
            });
        }
    });

    async function checkIfUserPostedInOtherSchoolPromise() {
        try {
            const db_res = await db.query('SELECT name FROM ap_shares WHERE shared_by=$1 AND school_id!=$2 AND deleted_at is NULL AND picked_up_at is NULL', [req.userData.id, req.userData.school_id]);
            
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

exports.editOffer = (req, res, next) => {

    const { errors, isValid } = validateNewShare(req.body);
    if(!isValid) {
        return res.status(200).json(errors);
    }

    const sh_ns_id = req.body.offer_id;
    const sh_ns_name = req.body.ns_name;
    const sh_ns_price = req.body.ns_price;
    const sh_ns_active_to = req.body.ns_active_to;
    const sh_ns_description = req.body.ns_description;

    db.query('UPDATE ap_shares SET name=$1, price=$2, description=$3 WHERE id=$4 AND shared_by=$5', [sh_ns_name, sh_ns_price, sh_ns_description, sh_ns_id, req.userData.id], function(reg_err, result) {
        console.log(reg_err);
        if (!reg_err) {
            res.status(200).json({success: true});
        } else {
            res.status(200).json({error: true});
        }
    });

}

exports.deleteOffer = (req, res, next) => {
    
    const offer_id = req.body.offer_id;
    removeOffer();

    async function removeOffer() {
        try {
            const result = await db.query('UPDATE ap_shares SET deleted_at=NOW() WHERE id=$1 AND shared_by=$2', [offer_id, req.userData.id]);
            res.status(200).json({
                error: false
            });
        } catch(err) {
            res.status(200).json({
                error: true
            });
        }
    }
}

exports.getAllOffersFromSchool = (req, res, next) => {
    
    getOffers();

    async function getOffers() {
        const offers = await db.query('SELECT ap_shares.*, usr.first_name, usr.phone_number FROM ap_shares INNER JOIN usr_users usr ON ap_shares.shared_by=usr.id WHERE ap_shares.school_id=$1 AND ap_shares.deleted_at is null AND ap_shares.picked_up_at is NULL ORDER BY id DESC', [req.userData.school_id]);
        res.status(200).json({
            success: true,
            offers: offers.rows
        });
    }
}

exports.getAllUserOffers = (req, res, next) => {

    getOffers();

    async function getOffers() {
        const offers = await db.query('SELECT ap_shares.*, usr.first_name, usr.phone_number FROM ap_shares INNER JOIN usr_users usr ON ap_shares.shared_by=usr.id WHERE ap_shares.school_id=$1 AND ap_shares.deleted_at is null AND ap_shares.shared_by=$2 AND ap_shares.picked_up_at is NULL', [req.query.school_id, req.userData.id]);
        res.status(200).json({
            success: true,
            offers: offers.rows
        });
    }
}

exports.getExactOffer = (req, res, next) => {
    
    const offer_id = req.params.id;
    getOffer();

    async function getOffer() {
        const offer = await db.query('SELECT ap_shares.*, usr.first_name, usr.phone_number, ap_conversations.id as conv_id FROM ap_shares INNER JOIN usr_users usr ON ap_shares.shared_by=usr.id LEFT JOIN ap_conversations ON (ap_conversations.offering_id=ap_shares.shared_by AND ap_conversations.interested_id=$3 AND ap_conversations.offer_id=$2) WHERE ap_shares.school_id=$1 AND ap_shares.deleted_at is null AND ap_shares.id=$2 AND picked_up_at IS NULL', [req.userData.school_id, offer_id, req.userData.id]);
        res.status(200).json({
            success: true,
            offer: offer.rows[0]
        });
    }

}

exports.getOfferToEdit = (req, res, next) => {

    const offer_id = req.params.id;
    getOffer();

    async function getOffer() {
        const offer = await db.query('SELECT ap_shares.*, usr.first_name, usr.phone_number FROM ap_shares INNER JOIN usr_users usr ON ap_shares.shared_by=usr.id WHERE ap_shares.school_id=$1 AND ap_shares.deleted_at is null AND ap_shares.id=$2 AND ap_shares.shared_by=$3', [req.userData.school_id, offer_id, req.userData.id]);
        res.status(200).json({
            success: true,
            offer: offer.rows[0]
        });
    }
}


// pickups pickups pickups pickups pickups pickups pickups pickups pickups pickups pickups pickups pickups pickups pickups

exports.pickupGenerateNewCode = (req, res, next) => {
    
    const offer_id = req.body.offer_id;
    checkUniqueCode();

    async function checkUniqueCode() {

        do {
            id = randomstring.generate({
                length: 8,
                charset: 'hex',
            });
        } while (await checkInDb(id));
        
        try {
            const result = await db.query(`UPDATE ap_shares SET pickup_code=$1, pickup_code_generated_at=NOW() WHERE id=$2 AND shared_by=$3 RETURNING pickup_code_generated_at as generated_at`, [id, offer_id, req.userData.id]);
            db.query(`UPDATE ap_shares SET pickup_code=null, pickup_code_generated_at=null WHERE id!=$1 AND shared_by=$2`, [offer_id, req.userData.id])
            res.status(200).json({
                code: id,
                generated_at: result.rows[0].generated_at
            });
        } catch(err) {
            res.status(200).json({
                error: true
            });
        }
     }

    async function checkInDb(code) {
        try {
            let dbResult = await db.query('SELECT id FROM ap_shares WHERE pickup_code=$1 AND deleted_at is not null', [code]);
            if (dbResult.rowCount > 0) return true;
            else return false;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    
    }
}