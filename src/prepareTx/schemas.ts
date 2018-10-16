import { prepare } from './prepare';
import { SIGN_TYPE } from './constants';
import { config, TRANSACTION_TYPE_VERSION } from '@waves/signature-generator';

const { wrap, schema, processors } = prepare;

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
            wrap('price', 'price', processors.toBigNumber),
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('matcherFee', 'matcherFee', processors.toBigNumber),
            wrap('expiration', 'expiration', processors.expiration),
            'senderPublicKey',
            'timestamp',
            'signature'
        );

        export const cancelOrder = schema(
            wrap('id', 'orderId', processors.noProcess),
            wrap('senderPublicKey', 'sender', processors.noProcess),
            'signature'
        );

        export const issue = schema(
            wrap('version', 'version', processors.addValue(TRANSACTION_TYPE_VERSION.ISSUE)),
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            'senderPublicKey',
            'name',
            'description',
            wrap(null, 'quantity', processors.quantity),
            wrap('precision', 'decimals', processors.noProcess),
            wrap('reissuable', 'reissuable', processors.noProcess),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            wrap('type', 'type', processors.addValue(SIGN_TYPE.ISSUE)),
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
            wrap('quantity', 'quantity', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
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
    }

    export module sign {

        export const matcherOrders = schema(
            'senderPublicKey',
            'timestamp'
        );

        export const auth = schema(
            'prefix',
            'host',
            'data'
        );

        export const coinomatConfirmation = schema(
            wrap('prefix', 'prefix', processors.addValue('Coinomat')),
            'timestamp'
        );

        export const createOrder = schema(
            'matcherPublicKey',
            'amountAsset',
            'priceAsset',
            'orderType',
            'price',
            'amount',
            'matcherFee',
            wrap('expiration', 'expiration', processors.expiration),
            'senderPublicKey',
            'timestamp'
        );

        export const cancelOrder = schema(
            'senderPublicKey',
            wrap('id', 'orderId', processors.noProcess)
        );

        export const issue = schema(
            'senderPublicKey',
            'name',
            'description',
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            wrap(null, 'quantity', processors.quantity),
            wrap('precision', 'precision', processors.noProcess),
            wrap('reissuable', 'reissuable', processors.noProcess),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp)
        );

        export const transfer = schema(
            'senderPublicKey',
            wrap('amount', 'assetId', processors.moneyToAssetId),
            wrap('fee', 'feeAssetId', processors.moneyToAssetId),
            wrap('timestamp', 'timestamp', processors.timestamp),
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('recipient', 'recipient', processors.noProcess),
            wrap('attachment', 'attachment', processors.orString)
        );

        export const reissue = schema(
            'senderPublicKey',
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            wrap('assetId', 'assetId', processors.noProcess),
            wrap('quantity', 'quantity', processors.toBigNumber),
            wrap('reissuable', 'reissuable', processors.noProcess),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp)
        );

        export const burn = schema(
            'senderPublicKey',
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            wrap('assetId', 'assetId', processors.noProcess),
            wrap('quantity', 'quantity', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp)
        );

        export const lease = schema(
            'senderPublicKey',
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            wrap('recipient', 'recipient', processors.noProcess),
            wrap('amount', 'amount', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp)
        );

        export const cancelLeasing = schema(
            'senderPublicKey',
            wrap('chainId', 'chainId', processors.addValue(() => config.getNetworkByte())),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
            wrap('leaseId', 'transactionId', processors.noProcess)
        );

        export const alias = schema(
            'senderPublicKey',
            wrap('alias', 'alias', processors.noProcess),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp),
        );

        export const massTransfer = schema(
            'senderPublicKey',
            wrap('totalAmount', 'assetId', processors.moneyToAssetId),
            wrap('transfers', 'transfers', processors.transfers(
                processors.noProcess,
                processors.toBigNumber
            )),
            wrap('timestamp', 'timestamp', processors.timestamp),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('attachment', 'attachment', processors.noProcess),
        );

        export const data = schema(
            'senderPublicKey',
            'data',
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp)
        );

        export const setScript = schema(
            'senderPublicKey',
            'script',
            wrap('chainId', 'chainId', processors.addValue(() => config.get('networkByte'))),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp)
        );

        export const sponsorship = schema(
            'senderPublicKey',
            wrap('minSponsoredAssetFee', 'assetId', processors.moneyToAssetId),
            wrap('minSponsoredAssetFee', 'minSponsoredAssetFee', processors.toBigNumber),
            wrap('fee', 'fee', processors.toBigNumber),
            wrap('timestamp', 'timestamp', processors.timestamp)
        );
    }
}

const hasNoApiMethod = schemaType => () => {
    throw new Error(`Has no method for prepare ${schemaType}`);
};

export function getSchemaByType(type: SIGN_TYPE) {
    switch (type) {
        case SIGN_TYPE.MATCHER_ORDERS:
            return { api: hasNoApiMethod('api, get orders'), sign: schemas.sign.matcherOrders };
        case SIGN_TYPE.AUTH:
            return { api: hasNoApiMethod('api auth'), sign: schemas.sign.auth };
        case SIGN_TYPE.COINOMAT_CONFIRMATION:
            return { api: schemas.api.coinomatConfirmation, sign: schemas.sign.coinomatConfirmation };
        case SIGN_TYPE.CREATE_ORDER:
            return { api: schemas.api.createOrder, sign: schemas.sign.createOrder };
        case SIGN_TYPE.CANCEL_ORDER:
            return { api: schemas.api.cancelOrder, sign: schemas.sign.cancelOrder };
        case SIGN_TYPE.TRANSFER:
            return { api: schemas.api.transfer, sign: schemas.sign.transfer };
        case SIGN_TYPE.ISSUE:
            return { api: schemas.api.issue, sign: schemas.sign.issue };
        case SIGN_TYPE.REISSUE:
            return { api: schemas.api.reissue, sign: schemas.sign.reissue };
        case SIGN_TYPE.BURN:
            return { api: schemas.api.burn, sign: schemas.sign.burn };
        case SIGN_TYPE.LEASE:
            return { api: schemas.api.lease, sign: schemas.sign.lease };
        case SIGN_TYPE.CANCEL_LEASING:
            return { api: schemas.api.cancelLeasing, sign: schemas.sign.cancelLeasing };
        case SIGN_TYPE.CREATE_ALIAS:
            return { api: schemas.api.alias, sign: schemas.sign.alias };
        case SIGN_TYPE.MASS_TRANSFER:
            return { api: schemas.api.massTransfer, sign: schemas.sign.massTransfer };
        case SIGN_TYPE.DATA:
            return { api: schemas.api.data, sign: schemas.sign.data };
        case SIGN_TYPE.SET_SCRIPT:
            return { api: schemas.api.setScript, sign: schemas.sign.setScript };
        case SIGN_TYPE.SPONSORSHIP:
            return { api: schemas.api.sponsorship, sign: schemas.sign.sponsorship };
    }
}
