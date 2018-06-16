const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "288925975530-utb8d799vt06ft93j03anb6a35t4003h.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// verify().catch(console.error);

module.exports = {
    getpayload : async function (token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        return ticket.getPayload();
        // const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
};