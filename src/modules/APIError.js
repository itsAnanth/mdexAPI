 // from m-dy
 
 class APIError extends Error {

    static OTHER = 0;
    static AUTHORIZATION = 1;
    static INVALID_REQUEST = 2;
    static INVALID_RESPONSE = 3;

    constructor(reason = 'Unknown Request Error', code = 0, ...params) {
        super(...params);

        this.code = code;

        this.name = 'APIError';

        if (typeof reason === 'string')
            this.message = reason;
        else {
            if (reason.errors instanceof Array && reason.errors.length > 0) {
                this.message = `${reason.errors[0].detail} (${reason.errors[0].status}: ${reason.errors[0].title})`;
                if (reason.errors[0].status === 400 || reason.errors[0].status === 404) 
                    this.code = APIRequestError.INVALID_REQUEST;
                else if (reason.errors[0].status === 403) 
                    this.code = APIRequestError.AUTHORIZATION;
                else if (code > 500) 
                    this.code = APIRequestError.INVALID_RESPONSE;
            } else this.message = 'Unknown Reason.';
        }
    }
}
export default APIError;