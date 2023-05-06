const db = require('../middleware/db');
const moment = require('moment');
const { USER_LOGIN, USER_LOGOUT, MESSAGE_SENT, MESSAGE_VIEWED, PICKUP_REQUEST_CHECK, PICKUP_REQUEST_REJECTED, PICKUP_CONSENT_REQUEST, PICKUP_CONSENT_RESPONSE } = require('./Events');
 
var sockets = {  };

sockets.init = function (server, port) {
    const io = require('socket.io').listen(server);
    const socketsList = require('../components/mongodb/models/socket');

    io.sockets.on('connection', function (socket) {
        
        sockets = addUser(sockets, {db_id: socket.handshake.query["userid"], sock_id: socket.client.id});
        socket.join(`user_room-${socket.handshake.query["userid"]}`);
        console.log('Socket connected - ' + socket.client.id);
        
        // EVENTS EVENTS EVENTS EVENTS EVENTS EVENTS
        socket.on(USER_LOGIN, (data) => {
            socket.join(`user_room-${data.userid}`);
            console.log("- - " + socket.client.id + "has log to account - -");
        });

        socket.on(USER_LOGOUT, (data) => {
            socket.leave(`user_room-${data.userid}`);
            console.log("- - " + socket.client.id + "has log out from account - -");
        });

        socket.on(MESSAGE_SENT, (data) => {
            insertRow();
            async function insertRow() {
                const result = await db.query(`INSERT INTO ap_messages VALUES(default, $1, null, $2, $3, default) RETURNING *, to_char(created_at, 'HH24:MI') as sent_at`, [data.convId, data.message, data.sentBy]);
                io.sockets.in(`user_room-${data.sentBy}`).in(`user_room-${data.sendingTo}`).emit("MESSAGE_SENT", result.rows);
            }
        });

        socket.on(MESSAGE_VIEWED, (data) => {
            updateViewedIndicator();
            async function updateViewedIndicator() {
                if (data.who == 0) {
                    const result = await db.query(`UPDATE ap_conversations SET interested_viewed=$1 WHERE id=$2`, [data.message_id, data.conv_id]);
                    // io.sockets.in(`user_room-${data.viewed_by}`).in(`user_room-${data.emit_to}`).emit("MESSAGE_VIEWED", data);
                    io.sockets.in(`user_room-${data.emit_to}`).emit("MESSAGE_VIEWED", data);
                } else {
                    const result = await db.query(`UPDATE ap_conversations SET offering_viewed=$1 WHERE id=$2`, [data.message_id, data.conv_id]);
                    // io.sockets.in(`user_room-${data.viewed_by}`).in(`user_room-${data.emit_to}`).emit("MESSAGE_VIEWED", data);
                    io.sockets.in(`user_room-${data.emit_to}`).emit("MESSAGE_VIEWED", data);
                }
            }
        });

        socket.on(PICKUP_REQUEST_CHECK, (data) => {
            console.log(data);

            checkPickupCode().then(res => {
                if (res == 2) {
                    // emit that code is invalid
                    io.sockets.in(`user_room-${data.requested_by}`).emit(PICKUP_REQUEST_REJECTED, {reject_reason: 1});
                } else {
                    if (io.sockets.adapter.rooms[`user_room-${data.shared_by}`]) {
                        io.sockets.in(`user_room-${data.requested_by}`).in(`user_room-${data.shared_by}`).emit("PICKUP_CONSENT_REQUEST", {requested_by: data.requested_by, offer_by: data.shared_by, offer_id: data.offer_id});
                    } else {
                        // emit that user who shares offer is not active at this moment
                        io.sockets.in(`user_room-${data.requested_by}`).emit(PICKUP_REQUEST_REJECTED, {reject_reason: 2});
                    }
                }
            });
            // f6bb9186
            async function checkPickupCode() {
                const result = await db.query('SELECT * FROM ap_shares WHERE id=$1 AND shared_by=$2 AND pickup_code=$3', [data.offer_id, data.shared_by, data.code]);
                if (result.rowCount > 0) {
                    const offer = result.rows[0];
                    const code_generated_at = offer.pickup_code_generated_at;
                    
                    if (new Date(code_generated_at).getTime() + 15*60000 > data.requested_at) {
                        // console.log(data.requested_at);
                        // console.log(new Date(code_generated_at).getTime() + 15*60000);
                        return 1
                    } else {
                        return 2
                    }
                } else {
                    return 2
                }
            }
        });

        socket.on(PICKUP_CONSENT_RESPONSE, (data) => {
            // do some stuff with database to end offer
            console.log(data.offer_id);
            
            if (data.response == 2) {
                db.query('UPDATE ap_shares SET picked_up_by=$1, picked_up_at=NOW() WHERE id=$2', [data.requested_by, data.offer_id]);      
            }
            io.sockets.in(`user_room-${data.requested_by}`).emit(PICKUP_CONSENT_RESPONSE, {response: data.response});
        });


        socket.on('disconnect', () => {
            sockets = removeUser(sockets, socket.client.id);
            console.log(socket.client.id + " - disconnected.");
            
            // console.log('Socket disconnected - ' + socket.client.id);
        })
    });
}  

module.exports = sockets;

// console.log(io.sockets.adapter.rooms['user_room-1']);

function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.sock_id] = user;
    return newList;
}

function removeUser(userList, socket_id) {
    let newList = Object.assign({}, userList);
    delete newList[socket_id];
    return newList;
}

var getSocketIdByUserid = function(obj, idd) {
    var returnKey = -1;

    $.each(obj, function(key, info) {
        if (info.db_id == idd) {
           returnKey = key;
            return false; 
        };   
    });
    
    return returnKey;       
           
}