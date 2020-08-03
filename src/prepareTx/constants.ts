import { IAdapterSignMethods } from './interfaces';
import { libs, protoPerialize } from '@waves/waves-transactions';
import * as wavesTransactions from '@waves/waves-transactions';
import { toNode as mlToNode } from '@waves/money-like-to-node';
import { Money } from '@waves/data-entities';
import { prepare } from './prepare';
import processors = prepare.processors;

const { LEN, SHORT, STRING, LONG, BASE58_STRING } = libs.marshall.serializePrimitives;
const { binary } = libs.marshall;
const { txToProtoBytes } = protoPerialize

const toNode = (data: any, convert?: Function) => {
    const r = mlToNode(data);
    r.timestamp = (new Date(r.timestamp)).getTime();
    return convert ? convert(r) : r;
};

const processScript = (srcScript: string | null) => {
    const scriptText = (srcScript || '').replace('base64:', '');
    return scriptText ? `base64:${scriptText}` : null;
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
    WAVES_CONFIRMATION = 1005,
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

const getCancelOrderBytes = (txData: any) => {
    const { orderId, id, senderPublicKey, sender } = txData;
    const pBytes = BASE58_STRING(senderPublicKey || sender);
    const orderIdBytes = BASE58_STRING(id || orderId);
    
    return Uint8Array.from([
        ...Array.from(pBytes),
        ...Array.from(orderIdBytes),
    ]);
};

export const SIGN_TYPES: Record<SIGN_TYPE, ITypesMap> = {
    
    [SIGN_TYPE.AUTH]: {
        getBytes: {
            1: (txData) => {
                const { host, data } = txData;
                const pBytes = LEN(SHORT)(STRING)('WavesWalletAuthentication');
                const hostBytes = LEN(SHORT)(STRING)(host || '');
                const dataBytes = LEN(SHORT)(STRING)(data || '');
                
                return Uint8Array.from([
                    ...Array.from(pBytes),
                    ...Array.from(hostBytes),
                    ...Array.from(dataBytes)
                ]);
            },
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.COINOMAT_CONFIRMATION]: {
        getBytes: {
            1: (txData) => {
                const { timestamp, prefix } = txData;
                const pBytes = LEN(SHORT)(STRING)(prefix);
                const timestampBytes = LONG(timestamp);
                
                return Uint8Array.from([
                    ...Array.from(pBytes),
                    ...Array.from(timestampBytes),
                ]);
            },
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.WAVES_CONFIRMATION]: {
        getBytes: {
            1: (txData) => {
                const { timestamp, publicKey } = txData;
                const pBytes = BASE58_STRING(publicKey);
                const timestampBytes = LONG(timestamp);
    
                return Uint8Array.from([
                    ...Array.from(pBytes),
                    ...Array.from(timestampBytes),
                ]);
            },
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.MATCHER_ORDERS]: {
        getBytes: {
            1: (txData) => {
                const { timestamp, senderPublicKey } = txData;
                const pBytes = BASE58_STRING(senderPublicKey);
                const timestampBytes = LONG(timestamp);
                
                return Uint8Array.from([
                    ...Array.from(pBytes),
                    ...Array.from(timestampBytes),
                ]);
            },
        },
        adapter: 'signRequest'
    },
    [SIGN_TYPE.CREATE_ORDER]: {
        getBytes: {
            0: binary.serializeOrder,
            1: binary.serializeOrder,
            2: binary.serializeOrder,
            3: binary.serializeOrder,
        },
        toNode: data => {
            const price =  processors.toOrderPrice(data);
            data = { ...data, price: Money.fromCoins(price, data.price.asset) };
            return toNode(data, wavesTransactions.order);
        },
        adapter: 'signOrder'
    },
    [SIGN_TYPE.CANCEL_ORDER]: {
        getBytes: {
            0: getCancelOrderBytes,
            1: getCancelOrderBytes,
        },
        adapter: 'signRequest',
        toNode: data => ({
            orderId: data.orderId,
            sender: data.senderPublicKey,
            senderPublicKey: data.senderPublicKey,
            signature: data.proofs && data.proofs[0]
        }),
    },
    [SIGN_TYPE.TRANSFER]: {
        getBytes: {
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: (data, networkByte: number) => (toNode({
            ...data,
            recipient: processors.recipient(String.fromCharCode(networkByte))(data.recipient),
            attachment: processors.attachment(data.attachment),
        }, wavesTransactions.transfer)),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.ISSUE]: {
        getBytes: {
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: data => toNode(
            {
                ...data,
                quantity: data.amount || data.quantity,
                script: processScript(data.script),
            },
            wavesTransactions.issue
        ),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.REISSUE]: {
        getBytes: {
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: data => {
            const quantity = data.amount || data.quantity;
            return toNode({ ...data, quantity }, wavesTransactions.reissue);
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.BURN]: {
        getBytes: {
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: data => {
            const quantity = data.amount || data.quantity;
            return toNode({ ...data, quantity }, wavesTransactions.burn);
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.EXCHANGE]: {
        getBytes: {
            0: (data) => binary.serializeTx({ ...data, version: 1 }),
            1: binary.serializeTx,
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: data => {
            const tx = toNode(data);
            const order1Sign = data.buyOrder.signature || data.buyOrder.proofs[0];
            const order1proofs = data.buyOrder.proofs ? data.buyOrder.proofs : data.buyOrder.signature;
            const order1 = { ...tx.buyOrder, signature: order1Sign, proofs: order1proofs };
            const order2Sign = data.sellOrder.signature || data.sellOrder.proofs[0];
            const order2proofs = data.sellOrder.proofs ? data.sellOrder.proofs : data.sellOrder.signature;
            const order2 = { ...tx.sellOrder, signature: order2Sign, proofs: order2proofs };
            return wavesTransactions.exchange({ ...tx, order1, order2 });
        },
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.LEASE]: {
        getBytes: {
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: (data, networkByte: number) => (toNode({
            ...data,
            recipient: processors.recipient(String.fromCharCode(networkByte))(data.recipient),
        }, wavesTransactions.lease)),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.CANCEL_LEASING]: {
        getBytes: {
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: data => toNode(data, wavesTransactions.cancelLease),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.CREATE_ALIAS]: {
        getBytes: {
            2: binary.serializeTx,
            3: txToProtoBytes
        },
        toNode: data => ({ ...toNode(data, wavesTransactions.alias), chainId: data.chainId }),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.MASS_TRANSFER]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
            2: txToProtoBytes
        },
        toNode: (data, networkByte: number) => (toNode({
            ...data,
            assetId: data.assetId || data.transfers[0].amount.asset.id,
            transfers: (data.transfers).map((item: any) => {
                const recipient = processors.recipient(String.fromCharCode(networkByte))(item.name || item.recipient);
                return { ...item, recipient };
            },),
            attachment: processors.attachment(data.attachment)
        }, wavesTransactions.massTransfer)),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.DATA]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
            2: txToProtoBytes
        },
        toNode: data => toNode(data, wavesTransactions.data),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SET_SCRIPT]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
            2: txToProtoBytes
        },
        toNode: data => toNode(
            {
                ...data,
                script: processScript(data.script)
            },
            wavesTransactions.setScript
        ),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SPONSORSHIP]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
            2: txToProtoBytes
        },
        toNode: data => toNode(data, wavesTransactions.sponsorship),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SET_ASSET_SCRIPT]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
            2: txToProtoBytes
        },
        toNode: data => toNode({
                ...data,
                script: processScript(data.script),
            },
            wavesTransactions.setAssetScript,
        ),
        adapter: 'signTransaction'
    },
    [SIGN_TYPE.SCRIPT_INVOCATION]: {
        getBytes: {
            0: binary.serializeTx,
            1: binary.serializeTx,
            2: txToProtoBytes
        },
        toNode: (data, networkByte: number) => (toNode({
            ...data,
            dApp: processors.recipient(String.fromCharCode(networkByte))(data.dApp)
        }, wavesTransactions.invokeScript)),
        adapter: 'signTransaction'
    },
};
