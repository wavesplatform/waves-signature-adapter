import { prepare } from './prepare';
import { SIGN_TYPE } from './constants';
import { config, TRANSACTION_TYPE_VERSION } from '@waves/signature-generator';
import * as fieldsType from './fieldTypes';

const { schema, wrap, signSchema, processors } = prepare;

const SIGN_SCHEMA = {
    [SIGN_TYPE.MATCHER_ORDERS]: [
        fieldsType.string('senderPublicKey', null, null, true),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.AUTH]: [
        fieldsType.string('prefix', null, processors.addValue('WavesWalletAuthentication'), true),
        fieldsType.string('host'),
        fieldsType.string('data'),
    ],
    [SIGN_TYPE.COINOMAT_CONFIRMATION]: [
        fieldsType.string('prefix', null, processors.addValue('Coinomat'), true),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.CREATE_ORDER]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.string('matcherPublicKey'),
        //@ts-ignore
        fieldsType.money('amount', 'amountAsset', processors.moneyToAssetId),
        //@ts-ignore
        fieldsType.money('price', 'priceAsset', processors.moneyToAssetId),
        fieldsType.orderType('orderType'),
        //@ts-ignore
        fieldsType.money('amount', 'amount', processors.toBigNumber),
        //@ts-ignore
        fieldsType.fromData(null, 'price', processors.toOrderPrice),
        //@ts-ignore
        fieldsType.numberLike('matcherFee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('expiration', null, processors.expiration),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.CANCEL_ORDER]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.string('id', 'orderId'),
    ],
    [SIGN_TYPE.ISSUE]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.assetName('name'),
        fieldsType.assetDescription('description'),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
        //@ts-ignore
        fieldsType.numberLike('quantity', null, processors.toBigNumber),
        fieldsType.precision('precision'),
        fieldsType.boolean('reissuable'),
        //@ts-ignore
        fieldsType.script('script', null, processors.orString, true),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.REISSUE]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
        fieldsType.asset('assetId'),
        //@ts-ignore
        fieldsType.numberLike('quantity', null, processors.toBigNumber),
        fieldsType.boolean('reissuable'),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.EXCHANGE]: [
        fieldsType.string('senderPublicKey', null, null, true),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        fieldsType.fromData('buyOrder'),
        fieldsType.fromData('sellOrder'),
        //@ts-ignore
        fieldsType.numberLike('amount', 'amount', processors.toBigNumber),
        //@ts-ignore
        fieldsType.numberLike('price', 'price', processors.toBigNumber),
        //@ts-ignore
        fieldsType.numberLike('buyMatcherFee', 'buyMatcherFee', processors.toBigNumber),
        //@ts-ignore
        fieldsType.numberLike('sellMatcherFee', 'sellMatcherFee', processors.toBigNumber)
    ],
    [SIGN_TYPE.BURN]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
        fieldsType.asset('assetId'),
        //@ts-ignore
        fieldsType.numberLike('amount', 'quantity', processors.toBigNumber),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.SPONSORSHIP]: [
        fieldsType.string('senderPublicKey', null, null, true),
        //@ts-ignore
        fieldsType.money('minSponsoredAssetFee', 'assetId', processors.moneyToAssetId),
        //@ts-ignore
        fieldsType.numberLike('minSponsoredAssetFee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.TRANSFER]: [
        fieldsType.string('senderPublicKey', null, null, true),
        //@ts-ignore
        fieldsType.money('amount', 'assetId', processors.moneyToAssetId),
        //@ts-ignore
        fieldsType.required('amount', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.money('fee', 'feeAssetId', processors.moneyToAssetId),
        //@ts-ignore
        fieldsType.required('fee', 'fee', processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
        fieldsType.aliasOrAddress('recipient'),
        //@ts-ignore
        fieldsType.attachment('attachment', null, processors.orString, true),
    ],
    [SIGN_TYPE.LEASE]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
        fieldsType.aliasOrAddress('recipient'),
        //@ts-ignore
        fieldsType.numberLike('amount', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.CANCEL_LEASING]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
        fieldsType.string('leaseId', 'transactionId'),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.CREATE_ALIAS]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.aliasName('alias'),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.MASS_TRANSFER]: [
        fieldsType.string('senderPublicKey', null, null, true),
        //@ts-ignore
        fieldsType.money('totalAmount', 'assetId', processors.moneyToAssetId),
        //@ts-ignore
        fieldsType.transfers('transfers', null, processors.transfers(
            processors.noProcess,
            processors.toBigNumber
        )),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.attachment('attachment', null, processors.orString, true),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
    ],
    [SIGN_TYPE.DATA]: [
        fieldsType.string('senderPublicKey', null, null, true),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
        fieldsType.data('data')
    ],
    [SIGN_TYPE.SET_SCRIPT]: [
        fieldsType.string('senderPublicKey', null, null, true),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
        fieldsType.script('script')
    ],
    [SIGN_TYPE.SET_ASSET_SCRIPT]: [
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.asset('assetId'),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toBigNumber),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
        fieldsType.asset_script('script')
    ],
    [SIGN_TYPE.SCRIPT_INVOCATION]: [
        fieldsType.number('type', null, processors.addValue(() => SIGN_TYPE.SCRIPT_INVOCATION), true),
        fieldsType.number('version', null, processors.addValue(() => 1), true),
    
        fieldsType.string('senderPublicKey', null, null, true),
        fieldsType.address('dappAddress'),
        //@ts-ignore
        fieldsType.call('call', 'call', processors.callFunc, true),
        //@ts-ignore
        fieldsType.payment('payment', null, processors.payments, true),
        //@ts-ignore
        fieldsType.numberLike('fee', null, processors.toNumberString),
        //@ts-ignore
        fieldsType.numberLike('fee', 'assetId', processors.moneyToAssetId),
        //@ts-ignore
        fieldsType.timestamp('timestamp', null, processors.timestamp),
        fieldsType.number('chainId', null, processors.addValue(() => config.getNetworkByte()), true),
    ]
};

module schemas {

    export module api {

        export const coinomatConfirmation = schema(
            wrap('prefix', 'prefix', processors.addValue('Coinomat')),
            'timestamp'
        );

        export const createOrder = schema(
            'matcherPublicKey',
            'orderType',
            wrap(null, 'assetPair', processors.assetPair),
            wrap(null, 'price', processors.toOrderPrice),
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('matcherFee', 'matcherFee', processors.toBigNumber),
            wrap('expiration', 'expiration', processors.expiration),
            'senderPublicKey',
            'timestamp',
            wrap('proofs', 'signature', processors.signatureFromProof)
        );

        export const createOrder_v2 = schema(
            'matcherPublicKey',
            'orderType',
            wrap(null, 'version', processors.addValue(2)),
            wrap(null, 'assetPair', processors.assetPair),
            wrap(null, 'price', processors.toOrderPrice),
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('matcherFee', 'matcherFee', processors.toBigNumber),
            wrap('expiration', 'expiration', processors.expiration),
            'senderPublicKey',
            'timestamp',
            'proofs'
        );

        export const cancelOrder = schema(
            wrap('id', 'orderId', processors.noProcess),
            wrap('senderPublicKey', 'sender', processors.noProcess),
            wrap('proofs', 'signature', processors.signatureFromProof)
        );

        export const issue = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.ISSUE)),
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            'senderPublicKey',
            'name',
            'description',
            wrap('quantity', 'quantity', processors.toBigNumber),
            wrap('precision', 'decimals', processors.noProcess),
            wrap('reissuable', 'reissuable', processors.noProcess),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.ISSUE)),
            wrap('script', 'script', processors.scriptProcessor),
            'proofs'
        );

        export const transfer = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.TRANSFER)),
            wrap('amount', 'assetId', processors.moneyToNodeAssetId),
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('fee', 'feeAssetId', processors.moneyToNodeAssetId),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('recipient', 'recipient', processors.recipient),
            wrap('attachment', 'attachment', processors.attachment),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'senderPublicKey',
            'proofs',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.TRANSFER))
        );

        export const reissue = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.REISSUE)),
            'senderPublicKey',
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            wrap('assetId', 'assetId', processors.noProcess),
            wrap('quantity', 'quantity', processors.toBigNumber),
            wrap('reissuable', 'reissuable', processors.noProcess),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.REISSUE))
        );

        export const burn = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.BURN)),
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            'senderPublicKey',
            wrap('assetId', 'assetId', processors.noProcess),
            wrap('amount', 'quantity', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.BURN))
        );

        export const exchange = schema(
            'senderPublicKey',
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('price', 'price', processors.toBigNumber),
            wrap('buyMatcherFee', 'buyMatcherFee', processors.toBigNumber),
            wrap('sellMatcherFee', 'sellMatcherFee', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'buyOrder',
            'sellOrder',
            'signature',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.BURN))
        );

        export const exchange_v2 = schema(
            wrap(null, 'version', processors.addValue(2)),
            'senderPublicKey',
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('price', 'price', processors.toBigNumber),
            wrap('buyMatcherFee', 'buyMatcherFee', processors.toBigNumber),
            wrap('sellMatcherFee', 'sellMatcherFee', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'buyOrder',
            'sellOrder',
            'proofs',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.BURN))
        );

        export const lease = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.LEASE)),
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            'senderPublicKey',
            wrap('recipient', 'recipient', processors.recipient),
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.LEASE))
        );

        export const cancelLeasing = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.CANCEL_LEASING)),
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            'senderPublicKey',
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            wrap('leaseId', 'leaseId', processors.noProcess),
            'proofs',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.CANCEL_LEASING))
        );

        export const alias = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.CREATE_ALIAS)),
            'senderPublicKey',
            wrap('alias', 'alias', processors.noProcess),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs',
            wrap('type', 'type', processors.addValue(SIGN_TYPE.CREATE_ALIAS))
        );

        export const massTransfer = schema(
            'senderPublicKey',
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.MASS_TRANSFER)),
            wrap('totalAmount', 'assetId', processors.moneyToNodeAssetId),
            wrap('transfers', 'transfers', processors.transfers(
                processors.recipient,
                processors.toBigNumber
            )),
            wrap('timestamp', 'timestamp', processors.timestamp),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('attachment', 'attachment', processors.attachment),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.MASS_TRANSFER)),
            'proofs'
        );

        export const data = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.DATA)),
            'senderPublicKey',
            'data',
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.DATA)),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs'
        );

        export const setScript = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.SET_SCRIPT)),
            'senderPublicKey',
            wrap('script', 'script', processors.scriptProcessor),
            wrap('chainId', 'chainId', processors.addValue(() => config.get('networkByte'))),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.SET_SCRIPT)),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs'
        );

        export const sponsorship = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.SPONSORSHIP)),
            'senderPublicKey',
            wrap('minSponsoredAssetFee', 'assetId', processors.moneyToAssetId),
            wrap('minSponsoredAssetFee', 'minSponsoredAssetFee', processors.toSponsorshipFee),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.SPONSORSHIP)),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs'
        );

        export const setAssetScript = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.SET_ASSET_SCRIPT)),
            'senderPublicKey',
            wrap('assetId', 'assetId', processors.noProcess),
            wrap('script', 'script', processors.scriptProcessor),
            wrap('chainId', 'chainId', processors.addValue(() => config.get('networkByte'))),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.SET_ASSET_SCRIPT)),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs'
        );
    
        export const scriptInvocation = schema(
            wrap('version', 'version', processors.addValue(1)),
            'senderPublicKey',
            wrap('dappAddress', 'dappAddress', processors.recipient),
            wrap('feeAssetId', 'feeAssetId', processors.noProcess),
            wrap('call', 'call', processors.callFunc),
            wrap('payment', 'payment', processors.paymentsToNode),
            wrap('chainId', 'chainId', processors.addValue(() => config.get('networkByte'))),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.SCRIPT_INVOCATION)),
            wrap('timestamp', 'timestamp', processors.timestamp),
            'proofs'
        );
    }

    export module sign {
        export const matcherOrders = signSchema(SIGN_SCHEMA[SIGN_TYPE.MATCHER_ORDERS]);
        export const auth = signSchema(SIGN_SCHEMA[SIGN_TYPE.AUTH]);
        export const coinomatConfirmation = signSchema(SIGN_SCHEMA[SIGN_TYPE.COINOMAT_CONFIRMATION]);
        export const createOrder = signSchema(SIGN_SCHEMA[SIGN_TYPE.CREATE_ORDER]);
        export const cancelOrder = signSchema(SIGN_SCHEMA[SIGN_TYPE.CANCEL_ORDER]);
        export const issue = signSchema(SIGN_SCHEMA[SIGN_TYPE.ISSUE]);
        export const transfer = signSchema(SIGN_SCHEMA[SIGN_TYPE.TRANSFER]);
        export const reissue = signSchema(SIGN_SCHEMA[SIGN_TYPE.REISSUE]);
        export const burn = signSchema(SIGN_SCHEMA[SIGN_TYPE.BURN]);
        export const lease = signSchema(SIGN_SCHEMA[SIGN_TYPE.LEASE]);
        export const cancelLeasing = signSchema(SIGN_SCHEMA[SIGN_TYPE.CANCEL_LEASING]);
        export const alias = signSchema(SIGN_SCHEMA[SIGN_TYPE.CREATE_ALIAS]);
        export const massTransfer = signSchema(SIGN_SCHEMA[SIGN_TYPE.MASS_TRANSFER]);
        export const data = signSchema(SIGN_SCHEMA[SIGN_TYPE.DATA]);
        export const setScript = signSchema(SIGN_SCHEMA[SIGN_TYPE.SET_SCRIPT]);
        export const sponsorship = signSchema(SIGN_SCHEMA[SIGN_TYPE.SPONSORSHIP]);
        export const setAssetScript = signSchema(SIGN_SCHEMA[SIGN_TYPE.SET_ASSET_SCRIPT]);
        export const exchange = signSchema(SIGN_SCHEMA[SIGN_TYPE.EXCHANGE]);
        export const scriptInvocation = signSchema(SIGN_SCHEMA[SIGN_TYPE.SCRIPT_INVOCATION]);
    }
}

//@ts-ignore
const hasNoApiMethod = schemaType => () => {
    throw new Error(`Has no method for prepare ${schemaType}`);
};

export function getSchemaByType(type: SIGN_TYPE): { sign: Function, api: Record<number, Function> } {
    switch (type) {
        case SIGN_TYPE.MATCHER_ORDERS:
            return {
                api: {
                    0: hasNoApiMethod('api, get orders'),
                    1: hasNoApiMethod('api, get orders')
                }, sign: schemas.sign.matcherOrders
            };
        case SIGN_TYPE.AUTH:
            return {
                api: {
                    0: hasNoApiMethod('api auth'),
                    1: hasNoApiMethod('api auth')
                }, sign: schemas.sign.auth
            };
        case SIGN_TYPE.COINOMAT_CONFIRMATION:
            return {
                api: {
                    0: schemas.api.coinomatConfirmation,
                    1: schemas.api.coinomatConfirmation
                }, sign: schemas.sign.coinomatConfirmation
            };
        case SIGN_TYPE.CREATE_ORDER:
            return {
                api: {
                    1: schemas.api.createOrder,
                    2: schemas.api.createOrder_v2
                }, sign: schemas.sign.createOrder
            };
        case SIGN_TYPE.CANCEL_ORDER:
            return {
                api: {
                    0: schemas.api.cancelOrder,
                    1: schemas.api.cancelOrder
                }, sign: schemas.sign.cancelOrder
            };
        case SIGN_TYPE.TRANSFER:
            return { api: { 2: schemas.api.transfer }, sign: schemas.sign.transfer };
        case SIGN_TYPE.ISSUE:
            return { api: { 2: schemas.api.issue }, sign: schemas.sign.issue };
        case SIGN_TYPE.REISSUE:
            return { api: { 2: schemas.api.reissue }, sign: schemas.sign.reissue };
        case SIGN_TYPE.BURN:
            return { api: { 2: schemas.api.burn }, sign: schemas.sign.burn };
        case SIGN_TYPE.EXCHANGE:
            return { api: { 1: schemas.api.exchange, 2: schemas.api.exchange_v2 }, sign: schemas.sign.exchange };
        case SIGN_TYPE.LEASE:
            return { api: { 2: schemas.api.lease }, sign: schemas.sign.lease };
        case SIGN_TYPE.CANCEL_LEASING:
            return { api: { 2: schemas.api.cancelLeasing }, sign: schemas.sign.cancelLeasing };
        case SIGN_TYPE.CREATE_ALIAS:
            return { api: { 2: schemas.api.alias }, sign: schemas.sign.alias };
        case SIGN_TYPE.MASS_TRANSFER:
            return { api: { 1: schemas.api.massTransfer }, sign: schemas.sign.massTransfer };
        case SIGN_TYPE.DATA:
            return { api: { 1: schemas.api.data }, sign: schemas.sign.data };
        case SIGN_TYPE.SET_SCRIPT:
            return { api: { 1: schemas.api.setScript }, sign: schemas.sign.setScript };
        case SIGN_TYPE.SPONSORSHIP:
            return { api: { 1: schemas.api.sponsorship }, sign: schemas.sign.sponsorship };
        case SIGN_TYPE.SET_ASSET_SCRIPT:
            return { api: { 1: schemas.api.setAssetScript }, sign: schemas.sign.setAssetScript };
        case SIGN_TYPE.SCRIPT_INVOCATION:
            return { api: { 1: schemas.api.scriptInvocation }, sign: schemas.sign.scriptInvocation };
    }
}
