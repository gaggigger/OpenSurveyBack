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
    }
};