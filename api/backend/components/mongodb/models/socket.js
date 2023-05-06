const mongoose = require('mongoose');

const socketSchema = mongoose.Schema({
    user_id: {
        type: Number
    }, 
    socket_id: {
        type: String
    }, 
    server: {
        type: Number
    }
})

var Socket = module.exports = mongoose.model('sockets', socketSchema);
// module.exports = mongoose.model('SocketUser', socketSchema);

module.exports.addUser = function(user_id, sock_id, port) {
    const sockModel = new Socket({
        user_id: user_id, 
        socket_id: sock_id,
        server: port
    })

    console.log('yes');
    

    sockModel.save()
            .then(doc => {
                console.log("connected");
            })
            .catch(err => {

            })
}

module.exports.removeUser = (sock_id) => {
    Socket.deleteOne({ socket_id: sock_id }, (err) => {
        if (!err) {
            
        } else {
            
        }
    });
}

module.exports.findSocketById = (usr_id) => new Promise((resolve, reject) => {
    Socket.findOne({ user_id: usr_id }, (err, res) => {
        if (!err) {
            if (res != null) {
                resolve(res["socket_id"]);
            }   
        } else {
            reject(err);
        }
    });
});