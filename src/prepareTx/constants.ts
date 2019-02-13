import {
    MATCHER_BYTES_GENERATOR_MAP,
    BYTES_GENERATORS_MAP,
    StringWithLength,
    generate,
    ISignatureGeneratorConstructor,
    Int
} from '@waves/signature-generator';
import { IAdapterSignMethods, IAuthData } from './interfaces';

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
    SPONSORSHIP = 14,
    SET_ASSET_SCRIPT = 15,
}

export enum SIGN_TYPE {
    AUTH = 1000,
    MATCHER_ORDERS = 1001,
    CREATE_ORDER = 1002,
    CANCEL_ORDER = 1003,
    COINOMAT_CONFIRMATION = 1004,
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
    SPONSORSHIP = 14,
    SET_ASSET_SCRIPT = 15,
}

export interface ITypesMap {
    signatureGenerator: Record<number, ISignatureGeneratorConstructor<any>>;
    adapter: keyof IAdapterSignMethods;
}

export const SIGN_TYPES: Record<SIGN_TYPE, ITypesMap> = {

    [SIGN_TYPE.AUTH]: {
        signatureGenerator: {
            0: generate<IAuthData>([
                new StringWithLength('prefix'),
                new StringWithLength('host'),
                new StringWithLength('data')
            ]),
            1: generate<IAuthData>([
                new StringWithLength('prefix'),
                new StringWithLength('host'),
                new StringWithLength('data')
            ])
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.COINOMAT_CONFIRMATION]: {
        signatureGenerator: {
            0: generate([
                new StringWithLength('prefix'),
                new Int('timestamp', 8)
            ]),
            1: generate([
                new StringWithLength('prefix'),
                new Int('timestamp', 8)
            ])
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.MATCHER_ORDERS]: {
        signatureGenerator: {
            0: MATCHER_BYTES_GENERATOR_MAP.AUTH_ORDER[1],
            ...MATCHER_BYTES_GENERATOR_MAP.AUTH_ORDER
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.CREATE_ORDER]: {
        signatureGenerator: {
            0: MATCHER_BYTES_GENERATOR_MAP.CREATE_ORDER[1],
            ...MATCHER_BYTES_GENERATOR_MAP.CREATE_ORDER
        },
        adapter: 'signOrder'
    },
    [SIGN_TYPE.CANCEL_ORDER]: {
        signatureGenerator: {
            0: MATCHER_BYTES_GENERATOR_MAP.CANCEL_ORDER[1],
            ...MATCHER_BYTES_GENERATOR_MAP.CANCEL_ORDER
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.TRANSFER]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.TRANSFER],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.ISSUE]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.ISSUE],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.REISSUE]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.REISSUE],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.BURN]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.BURN],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.EXCHANGE]: {
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.EXCHANGE],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.LEASE]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.LEASE],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.CANCEL_LEASING]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.CANCEL_LEASING],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.CREATE_ALIAS]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.CREATE_ALIAS],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.MASS_TRANSFER]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.MASS_TRANSFER],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.DATA]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.DATA],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SET_SCRIPT]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.SET_SCRIPT],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SPONSORSHIP]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.SPONSORSHIP],
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SET_ASSET_SCRIPT]: {
        //@ts-ignore
        signatureGenerator: BYTES_GENERATORS_MAP[TRANSACTION_TYPE_NUMBER.SET_ASSET_SCRIPT],
        adapter: 'signTransaction'
    },
};
