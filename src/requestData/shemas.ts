import { prepare } from './prepare';
import { SIGN_TYPE } from './constants';
import { TRANSACTION_TYPE_VERSION } from '@waves/waves-signature-generator';

export module schemas {

    export module api {

        export const createOrder = prepare.schema(
            'matcherPublicKey',
            'orderType',
            prepare.wrap('price', 'price', prepare.processors.bigNumberToNumber),
            prepare.wrap('amount', 'amount', prepare.processors.bigNumberToNumber),
            prepare.wrap('matcherFee', 'matcherFee', prepare.processors.bigNumberToNumber),
            prepare.wrap('expiration', 'expiration', prepare.processors.expiration),
            'senderPublicKey',
            'timestamp',
            'signature'
        );

        export const cancelOrder = prepare.schema(
            'orderId',
            prepare.wrap('senderPublicKey', 'sender', prepare.processors.noProcess),
            'signature'
        );

        export const issue = prepare.schema(
            'senderPublicKey',
            'name',
            'description',
            prepare.wrap(null, 'quantity', prepare.processors.quantity),
            prepare.wrap('precision', 'decimals', prepare.processors.noProcess),
            prepare.wrap('reissuable', 'reissuable', prepare.processors.noProcess),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.ISSUE)),
            'signature'
        );

        export const transfer = prepare.schema(
            prepare.wrap('amount', 'assetId', prepare.processors.moneyToNodeAssetId),
            prepare.wrap('amount', 'amount', prepare.processors.moneyToNumber),
            prepare.wrap('fee', 'feeAssetId', prepare.processors.moneyToNodeAssetId),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('recipient', 'recipient', prepare.processors.recipient),
            prepare.wrap('attachment', 'attachment', prepare.processors.attachment),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            'senderPublicKey',
            'signature',
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.TRANSFER))
        );

        export const reissue = prepare.schema(
            'senderPublicKey',
            prepare.wrap('assetId', 'assetId', prepare.processors.noProcess),
            prepare.wrap('quantity', 'quantity', prepare.processors.moneyToNumber),
            prepare.wrap('reissuable', 'reissuable', prepare.processors.noProcess),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            'signature',
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.REISSUE))
        );

        export const burn = prepare.schema(
            'senderPublicKey',
            prepare.wrap('assetId', 'assetId', prepare.processors.noProcess),
            prepare.wrap('quantity', 'quantity', prepare.processors.moneyToNumber),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            'signature',
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.BURN))
        );

        export const lease = prepare.schema(
            'senderPublicKey',
            prepare.wrap('recipient', 'recipient', prepare.processors.recipient),
            prepare.wrap('amount', 'amount', prepare.processors.moneyToNumber),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            'signature',
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.LEASE))
        );

        export const cancelLeasing = prepare.schema(
            'senderPublicKey',
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            prepare.wrap('leaseId', 'leaseId', prepare.processors.noProcess),
            'signature',
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.CANCEL_LEASING))
        );

        export const alias = prepare.schema(
            'senderPublicKey',
            prepare.wrap('alias', 'alias', prepare.processors.noProcess),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            'signature',
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.CREATE_ALIAS))
        );

        export const massTransfer = prepare.schema(
            'senderPublicKey',
            prepare.wrap('version', 'version', prepare.processors.addValue(TRANSACTION_TYPE_VERSION.MASS_TRANSFER)),
            prepare.wrap('totalAmount', 'assetId', prepare.processors.moneyToNodeAssetId),
            prepare.wrap('transfers', 'transfers', prepare.processors.transfers(
                prepare.processors.recipient,
                prepare.processors.moneyToNumber
            )),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('attachment', 'attachment', prepare.processors.attachment),
            prepare.wrap('type', 'type', prepare.processors.addValue(SIGN_TYPE.MASS_TRANSFER)),
            'proofs'
        );

    }

    export module sign {

        export const createOrder = prepare.schema(
            'matcherPublicKey',
            'amountAsset',
            'priceAsset',
            'orderType',
            prepare.wrap('price', 'price', prepare.processors.bigNumberToNumber),
            prepare.wrap('amount', 'amount', prepare.processors.bigNumberToNumber),
            prepare.wrap('matcherFee', 'matcherFee', prepare.processors.bigNumberToNumber),
            prepare.wrap('expiration', 'expiration', prepare.processors.expiration),
            'senderPublicKey',
            'timestamp'
        );

        export const cancelOrder = prepare.schema(
            'senderPublicKey',
            'orderId'
        );

        export const issue = prepare.schema(
            'senderPublicKey',
            'name',
            'description',
            prepare.wrap(null, 'quantity', prepare.processors.quantity),
            prepare.wrap('precision', 'precision', prepare.processors.noProcess),
            prepare.wrap('reissuable', 'reissuable', prepare.processors.noProcess),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp)
        );

        export const transfer = prepare.schema(
            'senderPublicKey',
            prepare.wrap('amount', 'assetId', prepare.processors.moneyToAssetId),
            prepare.wrap('fee', 'feeAssetId', prepare.processors.moneyToAssetId),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            prepare.wrap('amount', 'amount', prepare.processors.moneyToNumber),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('recipient', 'recipient', prepare.processors.noProcess),
            prepare.wrap('attachment', 'attachment', prepare.processors.orString)
        );

        export const reissue = prepare.schema(
            'senderPublicKey',
            prepare.wrap('assetId', 'assetId', prepare.processors.noProcess),
            prepare.wrap('quantity', 'quantity', prepare.processors.moneyToNumber),
            prepare.wrap('reissuable', 'reissuable', prepare.processors.noProcess),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp)
        );

        export const burn = prepare.schema(
            'senderPublicKey',
            prepare.wrap('assetId', 'assetId', prepare.processors.noProcess),
            prepare.wrap('quantity', 'quantity', prepare.processors.moneyToNumber),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp)
        );

        export const lease = prepare.schema(
            'senderPublicKey',
            prepare.wrap('recipient', 'recipient', prepare.processors.noProcess),
            prepare.wrap('amount', 'amount', prepare.processors.moneyToNumber),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp)
        );

        export const cancelLeasing = prepare.schema(
            'senderPublicKey',
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            prepare.wrap('leaseId', 'transactionId', prepare.processors.noProcess)
        );

        export const alias = prepare.schema(
            'senderPublicKey',
            prepare.wrap('alias', 'alias', prepare.processors.noProcess),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
        );

        export const massTransfer = prepare.schema(
            'senderPublicKey',
            prepare.wrap('totalAmount', 'assetId', prepare.processors.moneyToAssetId),
            prepare.wrap('transfers', 'transfers', prepare.processors.transfers(
                prepare.processors.noProcess,
                prepare.processors.moneyToNumber
            )),
            prepare.wrap('timestamp', 'timestamp', prepare.processors.timestamp),
            prepare.wrap('fee', 'fee', prepare.processors.moneyToNumber),
            prepare.wrap('attachment', 'attachment', prepare.processors.noProcess),
            'proofs'
        );
    }

    export function getSchemaByType(type: SIGN_TYPE) {
        switch (type) {
            case SIGN_TYPE.CREATE_ORDER:
                return { api: api.createOrder, sign: sign.createOrder };
            case SIGN_TYPE.CANCEL_ORDER:
                return { api: api.cancelOrder, sign: sign.cancelOrder };
            case SIGN_TYPE.TRANSFER:
                return { api: api.transfer, sign: sign.transfer };
            case SIGN_TYPE.ISSUE:
                return { api: api.issue, sign: sign.issue };
            case SIGN_TYPE.REISSUE:
                return { api: api.reissue, sign: sign.reissue };
            case SIGN_TYPE.BURN:
                return { api: api.burn, sign: sign.burn };
            case SIGN_TYPE.LEASE:
                return { api: api.lease, sign: sign.lease };
            case SIGN_TYPE.CANCEL_LEASING:
                return { api: api.cancelLeasing, sign: sign.cancelLeasing };
            case SIGN_TYPE.CREATE_ALIAS:
                return { api: api.alias, sign: sign.alias };
            case SIGN_TYPE.MASS_TRANSFER:
                return { api: api.massTransfer, sign: sign.massTransfer };
        }
    }
}
