const Express = require('express');
const App = Express();
const Router = Express.Router();
const Login = require('../services/login');
const User = require('../services/user');
const Response = require('../helpers/response');

Router.post('/', Response.apiHeaders, async function(req, res, next) {
    try {
        let token = '';
        const userInfo = await Login.getUserInfoFromRequest(req, res);
        if (userInfo.provider === 'guest') {
            token = await User.generateToken(userInfo);
        } else {
            const user = await User.add(userInfo);
            token = await User.generateToken(user);
        }
        res.status(200).json({
            'token': token
        });
    } catch(e) {
        return Response.sendError(res, e);
    }
});

module.exports = Router;
