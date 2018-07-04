import { AdapterType } from '../config';

export abstract class Adapter {

    public abstract getPublicKey(): Promise<string>;

    public abstract getAddress(): Promise<string>;

    public abstract sign(bytes: Uint8Array): Promise<string>;

    public abstract getSeed(): Promise<string>;

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
