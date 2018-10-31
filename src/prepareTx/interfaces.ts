import { SIGN_TYPE } from './constants';
import { IDATA_ENTRY, ISignatureGeneratorConstructor } from '@waves/signature-generator/src/signatureFactory/interface';
import { Money, BigNumber } from '@waves/data-entities';

export type TSignData =
    ISignAuthData |
    ISignCoinomatConfirmation |
    ISignCustom |
    ISignGetOrders |
    ISignCreateOrder |
    ISignCancelOrder |
    ISignTransferData |
    ISignIssue |
    ISignReissue |
    ISignBurn |
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

export interface ISignCustom {
    data: any;
    type: SIGN_TYPE.CUSTOM;
    generator: ISignatureGeneratorConstructor<any>;
    apiProcessor?: Function;
    signProcessor?: Function;
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
}

export interface ICoinomatData {
    timestamp: number;
}

export interface IGetOrders {
    timestamp: number;
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
}

export interface ICancelOrder {
    orderId: string;
}

export interface ICreateTxData {
    fee: Money;
    timestamp: number;
    sender?: string;
    proofs?: Array<string>;
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
    quantity: string | BigNumber;
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
    version: string;
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
