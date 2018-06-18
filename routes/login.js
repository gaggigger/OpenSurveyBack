const express = require('express');
const router = express.Router();
const app = express();
const loginGoogle = require('../services/login-google');
const loginGithub = require('../services/login-github');
const loginFacebook = require('../services/login-facebook');
const loginLinkedin = require('../services/login-linkedin');
const User = require('../services/user');

router.get('/login', async function(req, res, next) {
    //const userInfo = await loginGoogle.getpayload('eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkZGY1NGQzMDMyZDFmMGQ0OGMzNjE4ODkyY2E3NGMxYWMzMGFkNzcifQ.eyJhenAiOiIyODg5MjU5NzU1MzAtdXRiOGQ3OTl2dDA2ZnQ5M2owM2FuYjZhMzV0NDAwM2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyODg5MjU5NzU1MzAtdXRiOGQ3OTl2dDA2ZnQ5M2owM2FuYjZhMzV0NDAwM2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1MTc2NDc2NjgyMTgxNzAyOTgiLCJlbWFpbCI6InNvbG9mby5yYWxpdGVyYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InNUQnNKNUhhZ0oya0NVM1Fpa1pQNmciLCJleHAiOjE1MjkyNjI1MDEsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJqdGkiOiI1YzExMmUyMjgzOWMwMmViMDVhN2U5ZmE1ODYwZmM0ODZjNTc3NjQwIiwiaWF0IjoxNTI5MjU4OTAxLCJuYW1lIjoiU29sb2ZvIFJhbGl0ZXJhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tbUtSQTZ2MXBrOHcvQUFBQUFBQUFBQUkvQUFBQUFBQUFBcHMvbzlZTTFKRGxWcHMvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlNvbG9mbyIsImZhbWlseV9uYW1lIjoiUmFsaXRlcmEiLCJsb2NhbGUiOiJmciJ9.WYVUT_9THLltX8AGGjBH1p5slfQZtLALQIl8ia5fpDqblaMlhmC1BlzwYE76_KkM-EqO_0k4Ovty6Qm2U_fzdzjr_1zIO20YQyJKYqKd973O4LhHJN1ipxetyMJqh0SkJcIGEGwAJkzoyHzr9EzdlOpBT7OA1Ltf2kwUD7p_PAiUNudGwzeTQlHw6gDYyfNc9uwzTZGOj3KePqEFGy6aGdx24RdSHVV8woNnxESsKWtdxQTzGVCBZyH1eC2w_rjs93ye_MrE1WALl-X1Z87AX1sWP6gnQ2tHDmH1n5ujtw0GWlcnS7xW3hdrIeS-7ia_VuMGHampTwoqGeTL_7kpWw');
    //const userInfo = await loginGithub.getpayload('ace317d561d9ac98980d');
    // const userInfo = await loginFacebook.getpayload("10217262255574814", "EAAaRvrkXN2oBAP7xhPZBTtETChcZAGHgAZCzKWFk02YIG5B8RWAIt1uWHwoqE3ycObKeuGvB9kZA5OFVdUdCQ1AeC3fahkzOqZBD33qRWttFa9zHFDyNeu0pvqn6i89nwS7cmbEbtIp2Uly3A6QZBRkNg0ENGSuAaluWghgjeSR2CtYg6wdkn2fgFZC8nWKLRnUixwQmnjy5AZDZD");
    const userInfo = await loginLinkedin.getpayload(
        'AQTajqlo7LpyD6uAMpNhqnoIr30d9WgkAyoOPoQxkSvkrSWqNmgniiFsPIGo6fO8BJWxu1NBqaIO-5ui2LCxg_K4g3bnRPQqywgLOTWh5QQmONUe1rjbttjlnGfAGnY93ARF3UaeABETEs084Jm5Ii8nBkGIjBq-JWggVN4R',
        'http://localhost:8000/'
    );
    console.log(userInfo);
    // User.addOrUpdate(userInfo);

    res.send([]);
});

module.exports = router;
