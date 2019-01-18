import { BigNumber } from '@waves/data-entities';
import { path } from 'ramda';
import { parseTransactionBytes, TRANSACTION_TYPE_NUMBER } from '@waves/signature-generator';


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

export function currentFeeFactory(config: IFeeConfig): (bytes: Uint8Array, hasAccountScript: boolean, smartAssetIdList?: Array<string>) => BigNumber {
    return (bytes: Uint8Array, hasAccountScript: boolean, smartAssetIdList?: Array<string>) => {
        const tx = parseTransactionBytes(bytes);
        const accountFee = hasAccountScript ? config.smart_account_extra_fee : new BigNumber(0);
        const minFee: BigNumber = accountFee.plus(getConfigProperty(tx.type, 'fee', config));

        switch (tx.type) {
            case TRANSACTION_TYPE_NUMBER.ISSUE:
            case TRANSACTION_TYPE_NUMBER.REISSUE:
            case TRANSACTION_TYPE_NUMBER.CANCEL_LEASING:
            case TRANSACTION_TYPE_NUMBER.CREATE_ALIAS:
            case TRANSACTION_TYPE_NUMBER.LEASE:
            case TRANSACTION_TYPE_NUMBER.SET_ASSET_SCRIPT:
            case TRANSACTION_TYPE_NUMBER.SET_SCRIPT:
            case TRANSACTION_TYPE_NUMBER.SPONSORSHIP:
                return minFee;
            case TRANSACTION_TYPE_NUMBER.BURN:
                return minFee.plus(getBurnFee(tx, config, smartAssetIdList || []));
            case TRANSACTION_TYPE_NUMBER.TRANSFER:
                return minFee.plus(getTransferFee(tx, config, smartAssetIdList || []));
            case TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
                return minFee.plus(getMassTransferFee(tx, config, smartAssetIdList || []));
            case TRANSACTION_TYPE_NUMBER.DATA:
                return accountFee.plus(getDataFee(bytes, tx, config));
            default:
                throw new Error('Wrong transaction type!');
        }
    };
}

function getBurnFee(tx: any, config: IFeeConfig, smartAssetIdList: Array<string>): BigNumber {
    return smartAssetIdList.includes(tx.assetId) ? config.smart_asset_extra_fee : new BigNumber(0);
}

function getTransferFee(tx: any, config: IFeeConfig, smartAssetIdList: Array<string>): BigNumber {
    return smartAssetIdList.includes(tx.assetId) ? config.smart_asset_extra_fee : new BigNumber(0);
}

function getDataFee(bytes: Uint8Array, tx: any, config: IFeeConfig): BigNumber {
    const kbPrice = getConfigProperty(tx.type, 'price_per_kb', config) as BigNumber;
    return kbPrice.times(Math.floor(1 + (bytes.length - 1) / 1024));
}

function getMassTransferFee(tx: any, config: IFeeConfig, smartAssetIdList: Array<string>): BigNumber {
    const transferPrice: BigNumber = getConfigProperty(tx.type, 'price_per_transfer', config) as BigNumber;
    const transfersCount: number = path(['transfers', 'length'], tx) || 0;
    const smartAssetExtraFee = smartAssetIdList.includes(tx.assetId) ? config.smart_asset_extra_fee : new BigNumber(0);
    const minPriceStep = getConfigProperty(tx.type, 'min_price_step', config) as BigNumber;
    let price = transferPrice.times(transfersCount);

    if (!price.div(minPriceStep).isInteger()) {
        price = price.div(minPriceStep).dp(0, BigNumber.ROUND_UP).times(minPriceStep);
    }

    return price.plus(smartAssetExtraFee);
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
