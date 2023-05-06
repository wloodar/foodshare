import io from 'socket.io-client';
let socket = null;

const connectPromise = (userid) => {
    return new Promise((resolve, reject) => {
        socket = io(process.env.REACT_APP_GLOBAL_API_URL, {query: `userid=${userid}`});
        socket.on('connect', () => {
            if (socket.id !== undefined) {
                console.log(socket.id);
                resolve(socket);
            } else {
                resolve(false);
            }
        });

        socket.io.on('connect_error', function(err) {
            resolve(false);
        });
    });
}

function resetSocket(userid) {
}

export { 
    socket,
    connectPromise,
    resetSocket
};