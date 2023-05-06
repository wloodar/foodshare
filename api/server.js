const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const parseArgs = require('minimist');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// const mongoose = require('mongoose');
// mongoose.set('useCreateIndex', true)
// mongoose.connect('mongodb://localhost/ourworkspace', { useNewUrlParser: true });

const server = http.createServer(app);
const args = parseArgs(process.argv.slice(2));
const { name = 'default', port = '5005'} = args;
require('dotenv').config();

const apiAuthRoutes = require('./backend/routes/auth');
const userRoutes = require('./backend/routes/user');
const schoolRoutes = require('./backend/routes/school');
const offerRoutes = require('./backend/routes/offers'); 
const inboxRoutes = require('./backend/routes/inbox'); 
const adminRoutes = require('./backend/routes/admin'); 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload({
    useTempFiles: true
}));

app.use('/api/auth', apiAuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ args });
});

var exec = require("child_process").exec;
exec("sc query state= all", function(err, stdout) {
var lines = stdout.toString().split("\r\n").filter(function (line) {
    return line.indexOf("SERVICE_NAME") !== -1;
}).map(function (line) {
    return line.replace("SERVICE_NAME: ", "");
});
console.log(lines);
});

var sockets = require('./backend/sockets/SocketManager');
sockets.init(server, port);

server.listen(+port, '0.0.0.0', (err) => {
    if (err) {
      console.log(err.stack);
      return;
    }
  
    console.log(`Node [${name}] listens on http://127.0.0.1:${port}.`);
});