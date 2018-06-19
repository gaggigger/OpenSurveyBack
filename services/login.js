const LoginGoogle = require('../services/login-google');
const LoginGithub = require('../services/login-github');
const LoginFacebook = require('../services/login-facebook');
const LoginLinkedin = require('../services/login-linkedin');
const ServerException = require('../exceptions/ServerException');

module.exports = {
    getUserInfoFromRequest: async function(req, res) {
        switch (req.body.provider) {
            case 'google':
                return await LoginGoogle.getpayload(req.body.token);
            case 'facebook':
                return await LoginFacebook.getpayload(req.body.user_id, req.body.token);
            case 'github':
                return await LoginGithub.getpayload(req.body.token);
            case 'linkedin':
                return await LoginLinkedin.getpayload(req.body.token, req.body.redirect_uri);
            default:
                throw new ServerException.NotImplementedException();
        }
    }
};
