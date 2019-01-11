import { SIGN_TYPE } from './constants';
import { IDATA_ENTRY } from '@waves/signature-generator/src/signatureFactory/interface';
import { Money, BigNumber } from '@waves/data-entities';

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
    ISponsorshipData;

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
    quantity: string;
    decimals: number;
    reissuable: boolean;
}

export interface IBurn extends ICreateTxData {
    assetId: string;
    quantity: string;
}

export interface IExchange extends ICreateTxData {
    buyOrder: IOrder;
    sellOrder: IOrder;
    buyMatcherFee: Money;
    sellMatcherFee: Money;
}

export interface ILease extends ICreateTxData {
    amount: string;
    recipient: string;
}

export interface ICancelLeasing extends ICreateTxData {
    transactionId: string;
}

export interface ICreateAlias extends ICreateTxData {
    alias: string;
}

export interface IMassTransfer extends ICreateTxData {
    assetId: string;
    transfers: Array<{ recipient: string; amount: string; }>;
    attachment: string;
}

export interface IData extends ICreateTxData {
    data: Array<IDATA_ENTRY>;
    fee: Money;
}

export interface ISetScript extends ICreateTxData {
    script: string;
    chainId: number;
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
