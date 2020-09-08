import { SIGN_TYPE } from './constants';
import { Money } from '@waves/data-entities';
import { BigNumber } from '@waves/bignumber';

export interface IARGS_ENTRY {
    type: string;
    value: any;
}

export type TSignData =
    ISignAuthData |
    ISignCoinomatConfirmation |
    ISignGetOrders |
    ISignCreateOrder |
    ISignCancelOrder |
    ISignTransferData |
    ISignIssue |
    ISignReissue |
    ISignBurn |
    ISignExchange |
    ISignLease |
    ISignCancelLeasing |
    ISignCreateAlias |
    ISignMassTransfer |
    IDataTxData |
    ISetScriptData |
    ISponsorshipData |
    ISetAssetScriptData |
    IScriptInvocationData |
    ISIgnUpdateAssetInfo;

export interface ISignAuthData {
    data: IAuthData;
    type: SIGN_TYPE.AUTH;
}

export interface ISignCoinomatConfirmation {
    data: ICoinomatData;
    type: SIGN_TYPE.COINOMAT_CONFIRMATION;
}

export interface ISignGetOrders {
    data: IGetOrders;
    type: SIGN_TYPE.MATCHER_ORDERS;
}

export interface ISignCreateOrder {
    data: ICreateOrder;
    type: SIGN_TYPE.CREATE_ORDER;
}

export interface ISignCancelOrder {
    data: ICancelOrder;
    type: SIGN_TYPE.CANCEL_ORDER;
}

export interface ISignTransferData {
    data: ITransferData;
    type: SIGN_TYPE.TRANSFER;
}

export interface ISignIssue {
    data: IIssue;
    type: SIGN_TYPE.ISSUE;
}

export interface ISignReissue {
    data: IReissue;
    type: SIGN_TYPE.REISSUE;
}

export interface ISignBurn {
    data: IBurn;
    type: SIGN_TYPE.BURN;
}

export interface ISIgnUpdateAssetInfo {
    data: IUpdateAssetInfo;
    type: SIGN_TYPE.UPDATE_ASSET_INFO;
}

export interface ISignExchange {
    data: IExchange;
    type: SIGN_TYPE.EXCHANGE;
}


export interface ISignLease {
    data: ILease;
    type: SIGN_TYPE.LEASE;
}

export interface ISignCancelLeasing {
    data: ICancelLeasing;
    type: SIGN_TYPE.CANCEL_LEASING;
}

export interface ISignCreateAlias {
    data: ICreateAlias;
    type: SIGN_TYPE.CREATE_ALIAS;
}

export interface ISignMassTransfer {
    data: IMassTransfer;
    type: SIGN_TYPE.MASS_TRANSFER;
}

export interface IDataTxData {
    data: IData;
    type: SIGN_TYPE.DATA;
}

export interface ISetScriptData {
    data: ISetScript;
    type: SIGN_TYPE.SET_SCRIPT;
}

export interface ISponsorshipData {
    data: ISponsorship;
    type: SIGN_TYPE.SPONSORSHIP;
}

export interface ISetAssetScriptData {
    data: ISetAssetScript;
    type: SIGN_TYPE.SET_ASSET_SCRIPT;
}

export interface IScriptInvocationData {
    data: IScriptInvocation;
    type: SIGN_TYPE.SCRIPT_INVOCATION;
}

export interface IScriptInvocation extends ICreateTxData {
    payment: [Money] | [];
    dApp: string;
    call: {
        function: string;
        args?: Array<IARGS_ENTRY>;
    } | null;
}

export interface IAuthData {
    prefix: string;
    host: string;
    data: string;
    timestamp?: number;
    version?: number;
    proofs?: Array<string>;
}

export interface ICoinomatData {
    timestamp: number;
    version?: number;
    proofs?: Array<string>;
}

export interface IGetOrders {
    timestamp: number;
    version?: number;
    proofs?: Array<string>;
}

export interface ICreateOrder {
    matcherPublicKey: string;
    amountAsset: string;
    priceAsset: string;
    orderType: string;
    price: string;
    amount: string;
    expiration: number;
    matcherFee: string;
    timestamp: number;
    proofs?: Array<string>;
    version?: number;
}

export interface ICancelOrder {
    orderId: string;
    version?: number;
    timestamp?: number;
    proofs?: Array<string>;
}

export interface ICreateTxData {
    fee: Money;
    timestamp: number;
    sender?: string;
    proofs?: Array<string>;
    version?: number;
}

export interface ISetAssetScript extends ICreateTxData {
    assetId: string;
    script: string;
}

export interface ITransferData extends ICreateTxData {
    amount: Money;
    recipient: string;
    attachment?: string;
    senderPublicKey?: string;
}

export interface IIssue extends ICreateTxData {
    name: string;
    description: string;
    precision: number;
    quantity: string | number | BigNumber;
    reissuable: boolean;
}

export interface IReissue extends ICreateTxData {
    assetId: string;
    quantity: string | BigNumber | Money | number;
    reissuable: boolean;
}

export interface IBurn extends ICreateTxData {
    assetId: string;
    amount: string | BigNumber | Money;
}

export interface IUpdateAssetInfo extends ICreateTxData {
    assetId: string;
    name: string;
    description: string;
}

export interface IExchange extends ICreateTxData {
    buyOrder: IOrder;
    sellOrder: IOrder;
    buyMatcherFee: Money;
    sellMatcherFee: Money;
}

export interface ILease extends ICreateTxData {
    amount: string | BigNumber | Money;
    recipient: string;
}

export interface ICancelLeasing extends ICreateTxData {
    leaseId: string;
}

export interface ICreateAlias extends ICreateTxData {
    alias: string;
}

export interface IMassTransfer extends ICreateTxData {
    /**
     * @deprecated
     */
    totalAmount: Money;
    assetId: string;
    transfers: Array<{ recipient: string; amount: string  | number | BigNumber | Money; }>;
    attachment?: string;
}

export interface IDATA_ENTRY {
    key: string;
    type: string;
    value: any;
}

export interface IData extends ICreateTxData {
    data: Array<IDATA_ENTRY>;
    fee: Money;
}

export interface ISetScript extends ICreateTxData {
    script: string;
    chainId?: number;
}

export interface ISponsorship extends ICreateTxData {
    minSponsoredAssetFee: Money;
}

export interface IOrder {
    senderPublicKey?: string;
    matcherPublicKey: string;
    price: Money;
    amount: Money;
    timestamp: number;
    expiration: number;
    matcherFee: Money;
}

export interface IAdapterSignMethods {
    signRequest(databytes: Uint8Array, signData?: any): Promise<string>;

    signTransaction(bytes: Uint8Array, amountPrecision: number, signData?: any): Promise<string>;

    signOrder(bytes: Uint8Array, amountPrecision: number, signData: any): Promise<string>;
}
