const db = require('../middleware/db');

exports.getInbox = (req, res, next) => {

    const fetchType = req.query.type;
    if (fetchType == 0) {
        db.query(`SELECT ap_convs.id as conv_id, ap_convs.interested_id, ap_convs.interested_viewed, ap_convs.offering_viewed, ap_convs.offer_id, usr.first_name, usr.phone_number, messages.message, messages.id as message_id, messages.sent_by, to_char(messages.created_at, 'HH24:MI') as sent_at, offer.name as offer_name, offer.price as offer_price, offer.img_url as offer_image FROM ap_conversations ap_convs INNER JOIN ap_messages AS messages ON messages.id = ( SELECT id FROM ap_messages AS p2 WHERE p2.conv_id = ap_convs.id ORDER BY created_at DESC LIMIT 1) INNER JOIN usr_users as usr ON usr.id=ap_convs.interested_id INNER JOIN ap_shares as offer ON offer.id=ap_convs.offer_id WHERE ap_convs.offering_id = $1 AND ap_convs.interested_id != $1 AND offer.deleted_at is null AND offer.picked_up_at is null ORDER BY messages.created_at DESC`, [req.userData.id])
        .then(result => {
            return res.status(200).json({
                conversations: result.rows
            });
        }).catch(err => {
            console.log(err);
               
        });
    } else {
        db.query(`SELECT ap_convs.id as conv_id, ap_convs.interested_id, ap_convs.interested_viewed, ap_convs.offering_viewed, ap_convs.offer_id, usr.first_name, usr.phone_number, messages.message, messages.sent_by, messages.id as message_id, to_char(messages.created_at, 'HH24:MI') as sent_at, offer.name as offer_name, offer.price as offer_price, offer.img_url as offer_image FROM ap_conversations ap_convs INNER JOIN ap_messages AS messages ON messages.id = ( SELECT id FROM ap_messages AS p2 WHERE p2.conv_id = ap_convs.id ORDER BY created_at DESC LIMIT 1) INNER JOIN usr_users as usr ON usr.id=ap_convs.offering_id INNER JOIN ap_shares as offer ON offer.id=ap_convs.offer_id WHERE ap_convs.offering_id != $1 AND ap_convs.interested_id = $1 AND offer.deleted_at is null AND offer.picked_up_at is null ORDER BY messages.created_at DESC`, [req.userData.id])
        .then(result => {
            return res.status(200).json({
                conversations: result.rows
            });
        }).catch(err => {
            console.log(err);
        });
    }
}

exports.test1 = (req, res, next) => {
    // db.query(`SELECT convs.id,  array_agg(mess.*) as messages FROM ap_conversations convs LEFT JOIN ap_messages mess ON mess.conv_id = convs.id GROUP BY convs.id`)
    db.query('SELECT ap_convs.id as conv_id, ap_shares.name as offer_name, ap_shares.price as offer_price, ap_shares.img_url as offer_image, array_agg(row_to_json(messages.*)) as messages FROM ap_conversations ap_convs LEFT JOIN ap_shares ON ap_shares.id=ap_convs.offer_id LEFT JOIN ap_messages messages ON messages.conv_id = ap_convs.id WHERE ap_convs.id = $1 AND (ap_convs.offering_id = $2 OR ap_convs.interested_id = $2) AND ap_shares.deleted_at is null AND ap_shares.picked_up_at is null GROUP BY ap_convs.id, ap_shares.name, ap_shares.price, ap_shares.img_url', [])
        .then(result => {
            return res.status(200).json({
                result: result.rows
            });
        }).catch(err => {
            console.log(err);
               
        });
}

exports.getConversation = (req, res, next) => {

    const conv_id = req.query.convId;
    // db.query('SELECT ap_convs.id as conv_id, ap_convs.interested_id, ap_convs.offering_id, ap_shares.name as offer_name, ap_shares.price as offer_price, ap_shares.img_url as offer_image, usr_users.first_name,array_agg(row_to_json(messages.*)) as messages FROM ap_conversations ap_convs LEFT JOIN ap_shares ON ap_shares.id=ap_convs.offer_id LEFT JOIN ap_messages messages ON messages.conv_id = ap_convs.id INNER JOIN usr_users ON usr_users.id=ap_convs.offering_id WHERE ap_convs.id = $1 AND (ap_convs.offering_id = $2 OR ap_convs.interested_id = $2) AND ap_shares.deleted_at is null AND ap_shares.received_at is null GROUP BY ap_convs.id, ap_shares.name, ap_shares.price, ap_shares.img_url, ap_convs.interested_id, ap_convs.offering_id', [conv_id, req.userData.id])
    db.query('SELECT ap_convs.id as conv_id, ap_convs.interested_id, ap_convs.offering_id, ap_convs.interested_viewed, ap_convs.offering_viewed, ap_shares.name as offer_name, ap_shares.id as offer_id, ap_shares.price as offer_price, ap_shares.img_url as offer_image, ap_shares.available_to as offer_available_to, usr_users.first_name FROM ap_conversations ap_convs LEFT JOIN ap_shares ON ap_shares.id=ap_convs.offer_id LEFT JOIN ap_messages messages ON messages.conv_id = ap_convs.id INNER JOIN usr_users ON usr_users.id=ap_convs.offering_id WHERE ap_convs.id = $1 AND (ap_convs.offering_id = $2 OR ap_convs.interested_id = $2) AND ap_shares.deleted_at is null AND ap_shares.picked_up_at is null', [conv_id, req.userData.id])
        .then(result => {
            return res.status(200).json({
                conversation: result.rows
            });
        }).catch(err => {
            console.log(err);
        });
}

exports.getMessages = (req, res, next) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const conv_id = req.query.conv_id;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    db.query('SELECT * FROM ap_messages WHERE conv_id=$1 ORDER BY id DESC OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY', [conv_id, startIndex, limit])
        .then(result => {
            
            if (result.rowCount > 0) {
                return res.status(200).json({
                    messages: result.rows
                });
            } else {
                return res.status(200).json({
                    pagination: false
                });
            }
        }).catch(err => {
            console.log(err);
        });
}

exports.createConversation = (req, res, next) => {

    const { offer_id, offering_id, interested_id } = req.body;
 
    db.query('INSERT INTO ap_conversations VALUES(default, $1, $2, $3, default, null) RETURNING id', [offering_id, interested_id, offer_id])
        .then(result => {
            return res.status(200).json({
                message: true,
                conv_id: result.rows[0].id
            });
        }).catch(err => {
            return res.status(200).json({
                message: false
            });
        });
}