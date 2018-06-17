const {OAuth2Client} = require('google-auth-library');
const Config = require('../config');
const client = new OAuth2Client(Config.google.client_id);

// verify().catch(console.error);

module.exports = {
    getpayload : async function (token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: Config.google.client_id,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const userInfo = ticket.getPayload();
        console.log(userInfo);
        return {
            login: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture,
            provider: 'google'
        }
    }
};