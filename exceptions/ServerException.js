// 500
exports.InternalServerErrorException = class InternalServerErrorException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Internal Server Error';
        this.name = 'InternalServerError';
        this.status = 500;
        Error.captureStackTrace(this, InternalServerErrorException);
    }
};
// 501
exports.NotImplementedException = class NotImplementedException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Not Implemented';
        this.name = 'NotImplementedException';
        this.status = 501;
        Error.captureStackTrace(this, NotImplementedException);
    }
};
// 503
exports.ServiceUnavailableException = class ServiceUnavailableException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Service Unavailable';
        this.name = 'ServiceUnavailableException';
        this.status = 503;
        Error.captureStackTrace(this, ServiceUnavailableException);
    }
};