const Express = require('express');
const Router = Express.Router();
const Login = require('../services/login');
const User = require('../services/user');
const Response = require('../helpers/response');

Router.post('/login', async function(req, res, next) {
    try {
        const userInfo = await Login.getUserInfoFromRequest(req, res);
        const user = await User.addOrUpdate(userInfo);
        const token = await User.generateToken(user);
        res.status(200).json({
            'token': token
        });
    } catch(e) {
        return Response.sendError(res, 500, e);
    }
});

module.exports = Router;
