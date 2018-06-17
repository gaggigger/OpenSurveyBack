const https = require('https');
const querystring = require('querystring');
const URL = require('url');

module.exports = {
    fetch: function(url, data, method = 'GET', headers = {}) {
        return new Promise((resolv, reject) => {
            const aUrl = url.split('/');
            const hostname = aUrl.shift();
            let path = '/' + aUrl.join('/');
            let options = null;
            let response = '';
            let requestBody = null;
            const h = Object.assign({}, {
                'User-Agent': 'request'
            }, headers);

            if (method === 'POST') {
                requestBody = querystring.stringify(data);
                h['Content-Length'] = requestBody.length;
                options = {
                    hostname: hostname,
                    port: 443,
                    path: path,
                    method: method,
                    headers: h
                };
            } else if(method === 'GET') {
                let params = [];
                for(k in data) {
                    params.push(k + '=' + encodeURIComponent(data[k]));
                }
                if(params.length > 0) url += '?' + params;
                options = URL.parse(url);
                options.headers = Object.assign({}, h);
            }
            const req = https.request(options, (res) => {
                res.on('data', (d) => {
                    response += d;
                });
                res.on('end', () => {
                    if (options.headers.Accept === 'application/json') {
                        resolv(JSON.parse(response));
                    } else {
                        resolv(response);
                    }
                });
            });
            req.on('error', e => {
                reject(e);
            });
            if(requestBody !== null) req.write(requestBody);
            req.end();
        });
    }
};
