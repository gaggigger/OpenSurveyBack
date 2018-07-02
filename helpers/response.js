const jwt = require('jsonwebtoken');
const Config = require('../config');

module.exports = {
    sendError(res, err) {
        err.status = err.status || 500;
        return res.status(err.status).send({
            error : (err.message)? err.message : err
        });
    },
    apiHeaders: function(req, res, next) {
        if (Config.api.allowedOrigin.indexOf(req.headers.origin) > -1) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
        }
        // Allowed method
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');
        res.header('Access-Control-Allow-Credentials', true);
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    },
    apiToken: function(req, res, next) {
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers['authorization'];
        if (token) {
            jwt.verify(token, Config.api.secret, (err, decoded) => {
                if (! err) {
                    // TODO iat and exp
                    req.connectedUser = decoded;
                } else {
                    return res.status(403).send({
                        'error' : err.message
                    });
                }
            });
            next();
        } else {
            return res.status(401).send({
                'error' : 'Unauthorized'
            });
        }
    }
};