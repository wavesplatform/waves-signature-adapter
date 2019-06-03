import { BigNumber } from '@waves/bignumber';
import { path } from 'ramda';
import {
    IExchangeTransactionOrder,
    TTransaction,
    IDataTransaction,
    IMassTransferTransaction
} from '@waves/ts-types';


export function find<T>(some: Partial<T>, list: Array<T>) {
    const keys = Object.keys(some);
    //@ts-ignore
    const isEqual = (a) => keys.every(n => a[n] === some[n]);
    for (let i = 0; i < list.length; i++) {
        if (isEqual(list[i])) {
            return list[i];
        }
    }
    return null;
}

export function isEmpty(some: unknown): some is undefined {
    return some == null;
}

export function last<T>(list: Array<T>): T {
    return list[list.length - 1];
}

export const TRANSACTION_TYPE = { // TODO Remove after refactor ts-types lib
    GENESIS: 1 as 1,
    PAYMENT: 2 as 2,
    ISSUE: 3 as 3,
    TRANSFER: 4 as 4,
    REISSUE: 5 as 5,
    BURN: 6 as 6,
    EXCHANGE: 7 as 7,
    LEASE: 8 as 8,
    CANCEL_LEASE: 9 as 9,
    ALIAS: 10 as 10,
    MASS_TRANSFER: 11 as 11,
    DATA: 12 as 12,
    SET_SCRIPT: 13 as 13,
    SPONSORSHIP: 14 as 14,
    SET_ASSET_SCRIPT: 15 as 15,
    SCRIPT_INVOCATION: 16 as 16
};

export function currentCreateOrderFactory(config: IFeeConfig, minOrderFee: BigNumber): (order: IExchangeTransactionOrder<BigNumber>, hasMatcherScript?: boolean, smartAssetIdList?: Array<string>) => BigNumber {
    return (order, hasScript = false, smartAssetIdList = []) => {
        const accountFee: BigNumber = hasScript ? config.smart_account_extra_fee : new BigNumber(0);
        const extraFee: BigNumber = Object
            .values(order.assetPair)
            .map(id => {
                return id && smartAssetIdList.includes(id as string) ? config.smart_asset_extra_fee : new BigNumber(0);
            })
            .reduce((sum, item) => sum.add(item), new BigNumber(0));

        return minOrderFee.add(accountFee).add(extraFee);
    };
}

export function currentFeeFactory(config: IFeeConfig): (tx: TTransaction<BigNumber>, bytes: Uint8Array, hasAccountScript: boolean, smartAssetIdList?: Array<string>) => BigNumber {
    return (tx: TTransaction<BigNumber>, bytes: Uint8Array, hasAccountScript: boolean, smartAssetIdList?: Array<string>) => {
        const accountFee = hasAccountScript ? config.smart_account_extra_fee : new BigNumber(0);
        const minFee: BigNumber = accountFee.add(getConfigProperty(tx.type, 'fee', config));

        switch (tx.type) {
            case TRANSACTION_TYPE.ISSUE:
            case TRANSACTION_TYPE.CANCEL_LEASE:
            case TRANSACTION_TYPE.ALIAS:
            case TRANSACTION_TYPE.LEASE:
            case TRANSACTION_TYPE.SET_ASSET_SCRIPT:
            case TRANSACTION_TYPE.SET_SCRIPT:
            case TRANSACTION_TYPE.SPONSORSHIP:
                return minFee;
            case TRANSACTION_TYPE.REISSUE:
            case TRANSACTION_TYPE.BURN:
            case TRANSACTION_TYPE.TRANSFER:
                return minFee.add(getSmartAssetFeeByAssetId(tx.assetId, config, smartAssetIdList || []));
            case TRANSACTION_TYPE.MASS_TRANSFER:
                return minFee.add(getMassTransferFee(tx, config, smartAssetIdList || []));
            case TRANSACTION_TYPE.DATA:
                return accountFee.add(getDataFee(bytes, tx, config));
            default:
                throw new Error('Wrong transaction type!');
        }
    };
}

function getSmartAssetFeeByAssetId(assetId: string | null, config: IFeeConfig, smartAssetIdList: Array<string>): BigNumber {
    return assetId && smartAssetIdList.includes(assetId) ? config.smart_asset_extra_fee : new BigNumber(0);
}

function getDataFee(bytes: Uint8Array, tx: IDataTransaction<BigNumber>, config: IFeeConfig): BigNumber {
    const kbPrice = getConfigProperty(tx.type, 'price_per_kb', config) as BigNumber;
    return kbPrice.mul(Math.floor(1 + (bytes.length - 1) / 1024));
}

function getMassTransferFee(tx: IMassTransferTransaction<BigNumber>, config: IFeeConfig, smartAssetIdList: Array<string>): BigNumber {
    const transferPrice: BigNumber = getConfigProperty(tx.type, 'price_per_transfer', config) as BigNumber;
    const transfersCount: number = path(['transfers', 'length'], tx) || 0;
    const smartAssetExtraFee = tx.assetId && smartAssetIdList.includes(tx.assetId) ? config.smart_asset_extra_fee : new BigNumber(0);
    const minPriceStep = getConfigProperty(tx.type, 'min_price_step', config) as BigNumber;
    let price = transferPrice.mul(transfersCount);

    if (!price.div(minPriceStep).isInt()) {
        price = price.div(minPriceStep).roundTo(0, BigNumber.ROUND_MODE.ROUND_UP).mul(minPriceStep);
    }

    return price.add(smartAssetExtraFee);
}

function getConfigProperty<T extends keyof IFeeConfigItem>(type: number, propertyName: T, config: IFeeConfig): IFeeConfigItem[T] {
    const value = path(['calculate_fee_rules', type, propertyName], config) as IFeeConfigItem[T];
    return isEmpty(value) ? path(['calculate_fee_rules', 'default', propertyName], config) : value;
}

export interface IFeeConfig {
    smart_asset_extra_fee: BigNumber;
    smart_account_extra_fee: BigNumber;
    calculate_fee_rules: Record<number, Partial<IFeeConfigItem>> & { default: IFeeConfigItem }
}

export interface IFeeConfigItem {
    price_per_transfer?: BigNumber;
    price_per_kb?: BigNumber;
    add_smart_asset_fee: boolean;
    add_smart_account_fee: boolean;
    min_price_step: BigNumber;
    fee: BigNumber;
}
