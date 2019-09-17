///<reference path="../ramda-usage.d.ts"/>


import { BigNumber } from '@waves/bignumber';
import path = require('ramda/src/path');
import {
    IExchangeTransactionOrder,
    TTransaction,
    IDataTransaction,
    IMassTransferTransaction,
    IIssueTransaction
} from '@waves/ts-types';
import { WAVES_ID } from './prepareTx';


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

export function normalizeAssetId(assetId: string) {
    return assetId || WAVES_ID;
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
        const accountFee: BigNumber = hasScript ? new BigNumber(config.smart_account_extra_fee) : new BigNumber(0);
        const extraFee: BigNumber = Object
            .values(order.assetPair)
            .map(id => {
                return id && smartAssetIdList.includes(id as string) ? new BigNumber(config.smart_asset_extra_fee) : new BigNumber(0);
            })
            .reduce((sum, item) => sum.add(item), new BigNumber(0));

        return minOrderFee.add(accountFee).add(extraFee);
    };
}

export function currentFeeFactory(config: IFeeConfig): (tx: TTransaction<BigNumber>, bytes: Uint8Array, hasAccountScript: boolean, smartAssetIdList?: Array<string>) => BigNumber {
    return (tx: TTransaction<BigNumber>, bytes: Uint8Array, hasAccountScript: boolean, smartAssetIdList?: Array<string>) => {
        const accountFee = hasAccountScript ? new BigNumber(config.smart_account_extra_fee) : new BigNumber(0);
        const minFee = accountFee.add(getConfigProperty(tx.type, 'fee', config));

        switch (tx.type) {
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
            case TRANSACTION_TYPE.ISSUE:
                return getIssueFee(tx, accountFee, config);
            default:
                throw new Error('Wrong transaction type!');
        }
    };
}

function isNFT(tx: IIssueTransaction<BigNumber> & { precision?: number }): boolean {
    const { quantity, precision, decimals, reissuable } = tx;
    const nftQuantity = new BigNumber(quantity).eq(1);
    const nftPrecision = new BigNumber(precision || decimals || 0).eq(0);
    return !reissuable && nftPrecision && nftQuantity;
}

function getIssueFee(tx: IIssueTransaction<BigNumber> & { precision?: number }, accountFee: BigNumber, config: IFeeConfig): BigNumber {
    const minFee: BigNumber = accountFee.add(getConfigProperty(tx.type, 'fee', config));
    if (isNFT(tx)) {
        return accountFee.add(getConfigProperty(tx.type, 'nftFee', config));
    } else {
        return minFee;
    }
}

function getSmartAssetFeeByAssetId(assetId: string | null, config: IFeeConfig, smartAssetIdList: Array<string>): BigNumber {
    return assetId && smartAssetIdList.includes(assetId) ? new BigNumber(config.smart_asset_extra_fee) : new BigNumber(0);
}

function getDataFee(bytes: Uint8Array, tx: IDataTransaction<BigNumber>, config: IFeeConfig): BigNumber {
    const kbPrice = getConfigProperty(tx.type, 'price_per_kb', config) || 0;
    return new BigNumber(kbPrice).mul(Math.floor(1 + (bytes.length - 1) / 1024));
}

function getMassTransferFee(tx: IMassTransferTransaction<BigNumber>, config: IFeeConfig, smartAssetIdList: Array<string>): BigNumber {
    const transferPrice = new BigNumber(getConfigProperty(tx.type, 'price_per_transfer', config) || 0);
    const transfersCount: number = path(['transfers', 'length'], tx) || 0;
    const smartAssetExtraFee = tx.assetId && smartAssetIdList.includes(tx.assetId) ? new BigNumber(config.smart_asset_extra_fee) : new BigNumber(0);
    const minPriceStep = new BigNumber(getConfigProperty(tx.type, 'min_price_step', config));
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
    nftFee: BigNumber;
}
