export class ApiError extends Error {
    status;
    code;
    details;
    constructor(status, message, options) {
        super(message);
        this.status = status;
        this.code = options?.code;
        this.details = options?.details;
    }
}
