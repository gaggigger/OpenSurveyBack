// 400
exports.BadRequestException = class BadRequestException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Bad Request';
        this.name = 'BadRequestException';
        this.status = 400;
        Error.captureStackTrace(this, BadRequestException);
    }
};
// 401
exports.UnauthorizedException = class UnauthorizedException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Unauthorized';
        this.name = 'UnauthorizedException';
        this.status = 401;
        Error.captureStackTrace(this, UnauthorizedException);
    }
};
// 402
exports.PaymentRequiredException = class PaymentRequiredException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Payment Required';
        this.name = 'PaymentRequiredException';
        this.status = 402;
        Error.captureStackTrace(this, PaymentRequiredException);
    }
};
// 403
exports.ForbiddenException = class ForbiddenException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Forbidden';
        this.name = 'ForbiddenException';
        this.status = 403;
        Error.captureStackTrace(this, ForbiddenException);
    }
};
// 404
exports.NotFoundException = class NotFoundException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Not Found';
        this.name = 'NotFoundException';
        this.status = 404;
        Error.captureStackTrace(this, NotFoundException);
    }
};
// 405
exports.MethodNotAllowedException = class MethodNotAllowedException extends Error {
    constructor(...args) {
        super(...args);
        this.message = 'Method Not Allowed';
        this.name = 'MethodNotAllowedException';
        this.status = 405;
        Error.captureStackTrace(this, MethodNotAllowedException);
    }
};
