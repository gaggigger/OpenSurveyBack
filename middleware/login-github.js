const https = require('https');
const querystring = require('querystring');

const CLIENT_ID = '';
const CLIENT_S = '';

module.exports = {
    getpayload : function (token) {
        const postData = querystring.stringify({
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_S,
            'code': token
        });
        const options = {
            hostname: 'github.com',
            port: 443,
            path: '/login/oauth/access_token',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };
        let response = '';
        const req = https.request(options, (res) => {
            res.on('data', (d) => {
                response += d;
            });
            res.on('end', () => {
                console.log(response);
                // https://api.github.com/user?access_token=626e593ce6cb1968312d7cea7f83b14f923857c3
            });
        });
        req.write(postData);
        req.end();
    }
};