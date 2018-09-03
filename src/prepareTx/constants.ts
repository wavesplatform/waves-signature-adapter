import {
    AUTH_ORDER_SIGNATURE,
    CREATE_ORDER_SIGNATURE,
    CANCEL_ORDER_SIGNATURE,
    TX_NUMBER_MAP,
    StringWithLength,
    generate
} from '@waves/signature-generator';
import { IAuthData } from "./interfaces";

export enum TRANSACTION_TYPE_NUMBER {
    SEND_OLD = 2,
    ISSUE = 3,
    TRANSFER = 4,
    REISSUE = 5,
    BURN = 6,
    EXCHANGE = 7,
    LEASE = 8,
    CANCEL_LEASING = 9,
    CREATE_ALIAS = 10,
    MASS_TRANSFER = 11,
    DATA = 12,
    SET_SCRIPT = 13,
    SPONSORSHIP = 14
}

export enum SIGN_TYPE {
    AUTH = 1000,
    MATCHER_ORDERS = 1001,
    CREATE_ORDER = 1002,
    CANCEL_ORDER = 1003,
    ISSUE = 3,
    TRANSFER = 4,
    REISSUE = 5,
    BURN = 6,
    LEASE = 8,
    CANCEL_LEASING = 9,
    CREATE_ALIAS = 10,
    MASS_TRANSFER = 11,
    DATA = 12,
    SET_SCRIPT = 13,
    SPONSORSHIP = 14
}

export const SIGN_TYPES = {

    [SIGN_TYPE.AUTH]: {
        signatureGenerator: generate<IAuthData>([
            new StringWithLength('prefix'),
            new StringWithLength('host'),
            new StringWithLength('data')
        ]),
        adapter: 'signRequest'
    },
    [SIGN_TYPE.MATCHER_ORDERS]: {
        signatureGenerator: AUTH_ORDER_SIGNATURE,
        adapter: 'signRequest'
    },
    [SIGN_TYPE.CREATE_ORDER]: {
        signatureGenerator: CREATE_ORDER_SIGNATURE,
        adapter: 'signOrder'
    },
    [SIGN_TYPE.CANCEL_ORDER]: {
        signatureGenerator: CANCEL_ORDER_SIGNATURE,
        adapter: 'signRequest'
    },
    [SIGN_TYPE.TRANSFER]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.TRANSFER],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.ISSUE]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.ISSUE],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.REISSUE]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.REISSUE],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.BURN]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.BURN],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.LEASE]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.LEASE],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.CANCEL_LEASING]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.CANCEL_LEASING],
        adapter: 'signRequest'
    },
    [SIGN_TYPE.CREATE_ALIAS]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.CREATE_ALIAS],
        adapter: 'signRequest'
    },
    [SIGN_TYPE.MASS_TRANSFER]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.MASS_TRANSFER],
        adapter: 'signRequest'
    },
    [SIGN_TYPE.DATA]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.DATA],
        adapter: 'signRequest'
    },
    [SIGN_TYPE.SET_SCRIPT]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.SET_SCRIPT],
        adapter: 'signRequest'
    },
    [SIGN_TYPE.SPONSORSHIP]: {
        signatureGenerator: TX_NUMBER_MAP[TRANSACTION_TYPE_NUMBER.SPONSORSHIP],
        adapter: 'signRequest'
    }
};
