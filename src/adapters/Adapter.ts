import { AdapterType } from '../config';
import { Seed, config, utils } from '@waves/waves-signature-generator';

export abstract class Adapter {

    protected static _code: number;

    public abstract getPublicKey(): Promise<string>;

    public abstract getAddress(): Promise<string>;

    public abstract getPrivateKey(): Promise<string>;

    public abstract signRequest(bytes: Uint8Array): Promise<string>;

    public abstract signTransaction(bytes: Uint8Array, amountPrecision: number): Promise<string>;

    public abstract signOrder(bytes: Uint8Array, amountPrecision: number): Promise<string>;

    public abstract signData(bytes: Uint8Array): Promise<string>;

    public abstract getSeed(): Promise<string>;

    public static initOptions(options: { networkCode: number }) {
        this._code = options.networkCode;
        config.set({ networkByte: options.networkCode });
    }

    public static type: AdapterType = null;

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
    networkCode: string;
}
