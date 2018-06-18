module.exports = {
    sendError(res, status, err) {
        return res.status(status).send({
            error : (err.message)? err.message : err
        });
    }
};