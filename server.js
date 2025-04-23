//const dotenv = require('dotenv').config();
const https = require('https');
const fs = require('fs')
const app = require('./app')
const { networkInterfaces } = require('os');
const bcrypt = require('bcrypt')
const admin = require('./api/routes/admin')
const PORT = process.env.PORT;

async function setup() {
    const hash = await bcrypt.hash(process.env.ADMIN_KEY, 10);
    admin.set_key(hash)
}
setup()

const option = {
    key: fs.readFileSync('./cert/muhajirda_key.pem'),
    cert: fs.readFileSync('./cert/muhajirda_cert.pem'),
}

const server = https.createServer(option, app)

//create show network interface
const nets = networkInterfaces();
const results = {};
var ipOnly
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
            ipOnly = net.address
        }
    }
}
console.log(results)
//

server.listen(PORT,
    ()=> console.log(`its alive on https://${ipOnly}:${PORT}`)
);

