import { AdapterType } from '../config';
import { SIGN_TYPE, TSignData } from '../prepareTx';
import { Signable } from '../Signable';


export abstract class Adapter {

    public type: string;
    protected _code: number;
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
    
    public abstract getSignVersions(): Record<SIGN_TYPE, Array<number>>;

    public abstract getPublicKey(): Promise<string>;

    public abstract getAddress(): Promise<string>;

    public abstract getPrivateKey(): Promise<string>;

    public abstract signRequest(databytes: Uint8Array, signData?: any): Promise<string>;

    public abstract signTransaction(bytes: Uint8Array, amountPrecision: number, signData?: any): Promise<string>;

    public abstract signOrder(bytes: Uint8Array, amountPrecision: number, signData: any): Promise<string>;

    public abstract signData(bytes: Uint8Array): Promise<string>;

    public abstract getSeed(): Promise<string>;

    public static initOptions(options: { networkCode: number }) {
        Adapter._code = options.networkCode;
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

export interface IUser {
    encryptedSeed: string;
    password: string;
    encryptionRounds: number;
}

export interface IProofData {
    profs?: Array<string>;
    signature?: string;
}
