import { AdapterType } from '../config';
import { SIGN_TYPE, TSignData } from '../prepareTx';
import { libs, serializeCustomData } from '@waves/waves-transactions';
import { Signable } from '../Signable';
const { stringToBytes } = libs.crypto;


export abstract class Adapter {

    public type: string;
    protected _code: number;
    protected _isDestroyed = true;
    protected static _code: number;

    protected constructor(networkCode?: string | number) {
        networkCode = typeof networkCode === 'string' ? networkCode.charCodeAt(0) : networkCode;
        this.type = (this as any).constructor.type;
        this._code = networkCode || Adapter._code || ('W').charCodeAt(0);
    }

    public makeSignable(forSign: TSignData): Signable {
        return new Signable(forSign, this);
    }

    public isAvailable(): Promise<void> {
        return Promise.resolve();
    }

    public onDestroy(cb?: Function): void {
        return;
    }

    public getNetworkByte(): number {
        return this._code || Adapter._code;
    }

    public isDestroyed(): boolean {
        return this._isDestroyed;
    }

    public abstract getSignVersions(): Record<SIGN_TYPE, Array<number>>;

    public abstract getPublicKey(): Promise<string>;

    public abstract getAddress(): Promise<string>;

    public abstract getPrivateKey(): Promise<string>;

    public abstract signRequest(databytes: Uint8Array, signData?: any): Promise<string>;

    public abstract signTransaction(bytes: Uint8Array, amountPrecision: number, signData?: any): Promise<string>;

    public abstract signOrder(bytes: Uint8Array, amountPrecision: number, signData: any): Promise<string>;

    public abstract signData(bytes: Uint8Array): Promise<string>;

    public abstract getSeed(): Promise<string>;
    
    public abstract getEncodedSeed(): Promise<string>;

    public static initOptions(options: { networkCode: number }) {
        Adapter._code = options.networkCode;
    }

    public signCustomData(data: string|Array<number>|Uint8Array) {
        const bytes = typeof data === 'string' ? stringToBytes(data) : Uint8Array.from(data);
        const serializeData = { version: 1, binary: libs.crypto.base64Encode(bytes) } as any;
        const binary = serializeCustomData(serializeData);
        return this.signRequest(binary, { type: 'customData', ...serializeData })
    }
    
    public signApiTokenData(clientId: string, timestamp = Date.now()): Promise<{
        networkByte: number,
        signature: string,
        clientId: string,
        publicKey: string,
        seconds: number }
        > {
        
        const netByte = typeof this._code === 'string' ? this._code : String.fromCharCode(this._code);
        return this.getPublicKey()
            .then(publicKey => {
                const seconds = Math.floor(timestamp / 1000);
                const data = `${netByte}:${clientId}:${String(seconds)}`;
                return this.signCustomData(data).then(signature => {
                    return {
                        signature,
                        publicKey,
                        seconds,
                        clientId,
                        networkByte: this._code,
                    }
                });
            })
    }
    
    public static type: AdapterType = AdapterType.Seed;

    public static getUserList(): Promise<Array<string>> {
        return Promise.resolve([]);
    }

    public static isAvailable(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export interface IAdapterConstructor {
    new(): Adapter;

    type: AdapterType;

    getUserList(): Promise<Array<string>>;

    isAvailable(): Promise<boolean>;
}

export interface ISeedUser {
    encryptedSeed: string;
    password: string;
    encryptionRounds?: number;
}

export interface IPrivateKeyUser {
    encryptedPrivateKey: string;
    password: string;
    encryptionRounds?: number;
}


export type IUser = ISeedUser|IPrivateKeyUser;

export interface IProofData {
    profs?: Array<string>;
    signature?: string;
}
