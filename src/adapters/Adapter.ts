import { AdapterType } from '../config';
import { Seed, config, utils } from '@waves/waves-signature-generator';
import { getSchemaByType, SIGN_TYPES, TSignData } from '../prepareTx';
import { ISignatureGeneratorConstructor } from '@waves/waves-signature-generator/src/index';


export abstract class Adapter {

    public type: string;
    protected static _code: number;

    protected constructor() {
        this.type = (this as any).constructor.type;
    }

    public getBytes(forSign: TSignData): Promise<Uint8Array> {
        const prepare = getSchemaByType(forSign.type).sign;
        const dataForSign = prepare(forSign.data);
        const signatureGenerator = new (SIGN_TYPES[forSign.type].signatureGenerator as ISignatureGeneratorConstructor<any>)(dataForSign);

        return signatureGenerator.getBytes();
    }

    public signJSON(forSign: TSignData): Promise<string> {
        const method = SIGN_TYPES[forSign.type].adapter;

        return this.getBytes(forSign).then(bytes => this[method](bytes));
    }

    public getTxIdJSON(forSign: TSignData): Promise<string> {
        return this.getBytes(forSign).then(bytes => utils.crypto.buildTransactionId(bytes));
    }

    public getTxId(bytes: Uint8Array): Promise<string> {
        return Promise.resolve(utils.crypto.buildTransactionId(bytes));
    }

    public prepareDataForApi(forSign: TSignData, profData: IProofData): any {
        const prepare = getSchemaByType(forSign.type).api;

        return prepare({ ...forSign.data, ...profData });
    }

    public isAvailable(): Promise<void> {
        return Promise.resolve();
    }

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

export interface IProofData {
    profs?: Array<string>;
    signature?: string;
}
