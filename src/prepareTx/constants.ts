import { IAdapterSignMethods } from './interfaces';
import { binary } from '@waves/marshall';
import { toNode as mlToNode } from '@waves/money-like-to-node';
import { prepare } from './prepare';
import processors = prepare.processors;

const toNode = (data: any) => {
    const r = mlToNode(data);
    r.timestamp = (new Date(r.timestamp)).getTime();
    return r;
};

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
    SCRIPT_INVOCATION = 16,
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
    SCRIPT_INVOCATION = 16,
}

export interface ITypesMap {
    getBytes: Record<number, (data: any) => Uint8Array>;
    adapter: keyof IAdapterSignMethods;
    toNode?: (data: any, networkByte: number) => any;
}

export const SIGN_TYPES: Record<SIGN_TYPE, ITypesMap> = {

    [SIGN_TYPE.AUTH]: {
        getBytes: {
            0: (data) => Uint8Array.from(data),
            1: (data) => Uint8Array.from(data)
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.COINOMAT_CONFIRMATION]: {
        getBytes: {
            0: (data) => Uint8Array.from(data),
            1: (data) => Uint8Array.from(data)
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.MATCHER_ORDERS]: {
        getBytes: {
            0: (data) => Uint8Array.from(data),
            1: (data) => Uint8Array.from(data)
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.CREATE_ORDER]: {
        getBytes: {
            0: binary.serializeOrder,
            1: binary.serializeOrder
        },
        adapter: 'signOrder'
    },
    [SIGN_TYPE.CANCEL_ORDER]: {
        getBytes: {
            0: (data) => Uint8Array.from(data),
            1: (data) => Uint8Array.from(data)
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.TRANSFER]: {
        getBytes: {
            2: binary.serializeTx,
        },
        toNode: (data, networkByte: number) => (toNode({
            ...data,
            recipient: processors.recipient(String.fromCharCode(networkByte))(data.recipient),
            attachment: processors.attachment(data.attachment),
        })),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.ISSUE]: {
        getBytes: {
            2: binary.serializeTx,
        },
        toNode,
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.REISSUE]: {
        getBytes: {
            2: binary.serializeTx,
        },
        toNode: data => {
            const quantity = data.amount || data.quantity;
            return toNode({ ...data, quantity });
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.BURN]: {
        getBytes: {
            2: binary.serializeTx,
        },
        toNode: data => {
            const quantity = data.amount || data.quantity;
            return toNode({ ...data, quantity });
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.EXCHANGE]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
            2: binary.serializeTx,
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.LEASE]: {
        getBytes: {
            2: binary.serializeTx,
        },
        toNode,
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.CANCEL_LEASING]: {
        getBytes: {
            2: binary.serializeTx,
        },
        toNode,
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.CREATE_ALIAS]: {
        getBytes: {
            2: binary.serializeTx,
        },
        toNode: (data, networkByte: number) => (toNode({
            ...data, name: processors.recipient(String.fromCharCode(networkByte))(data.name),
        })),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.MASS_TRANSFER]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
        },
        toNode: (data, networkByte: number) => (toNode({
            ...data,
            transfers: (data.transfers).map((item: any) => {
                const recipient = processors.recipient(String.fromCharCode(networkByte))(item.name);
                return { ...item, recipient };
            }),
            attachment: processors.attachment(data.attachment)
        })),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.DATA]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SET_SCRIPT]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SPONSORSHIP]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
        },
        toNode,
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SET_ASSET_SCRIPT]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SCRIPT_INVOCATION]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
        },
        adapter: 'signTransaction'
    },
};
