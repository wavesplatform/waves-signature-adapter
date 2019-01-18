import { ERRORS } from './constants';


export class SignError extends Error {

    public code: ERRORS;

    constructor(message: string, code: ERRORS) {
        super(message);
        this.code = code;

        Object.setPrototypeOf(this, SignError.prototype);
    }

}
