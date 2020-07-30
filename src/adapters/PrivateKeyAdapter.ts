import { Adapter, IPrivateKeyUser, IUser } from './Adapter';
import { AdapterType, TX_VERSIONS } from '../config';
import { seedUtils, libs } from '@waves/waves-transactions';

const publicKey = libs.crypto.publicKey;
const address = libs.crypto.address;
const signWithPrivateKey = libs.crypto.signBytes;

export class PrivateKeyAdapter extends Adapter {

    private privateKey: string = '';
    private address: string = '';
    private publicKey: string = '';
    public static type = AdapterType.PrivateKey;


    constructor(data: string | IUser, networkCode?: string | number) {
        super(networkCode);

        if (typeof data === 'string') {
            this.privateKey = data;
        } else {
            const user = data as IPrivateKeyUser;
            const encryptionRounds = user.encryptionRounds;
            this.privateKey = seedUtils.Seed.decryptSeedPhrase(user.encryptedPrivateKey || '', user.password, encryptionRounds);
        }

        this.publicKey = publicKey({ privateKey: this.privateKey });
        this.address = address({ publicKey: this.publicKey }, this._code);
        this._isDestroyed = false;
    }

    public getSignVersions() {
        return TX_VERSIONS;
    }
    
    
    public getEncodedSeed() {
        return Promise.reject(Error('Method "getEncodedSeed" is not available!'));
    }

    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }
    
    public getSyncAddress(): string {
        return this.address;
    }
    
    public getSyncPublicKey(): string {
        return this.publicKey;
    }
    
    public getPublicKey(): Promise<string> {
        return Promise.resolve(this.publicKey);
    }

    public getPrivateKey(): Promise<string> {
        return Promise.resolve(this.privateKey);
    }

    public getAddress(): Promise<string> {
        return Promise.resolve(this.address);
    }

    public signRequest(bytes: Uint8Array): Promise<string> {
        return this._sign(bytes);
    }

    public signTransaction(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return this._sign(bytes);
    }

    public signOrder(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return this._sign(bytes);
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return this._sign(bytes);
    }

    private _sign(bytes: Uint8Array): Promise<string> {
        return Promise.resolve(signWithPrivateKey({ privateKey: this.privateKey }, bytes));
    }

    public static isAvailable() {
        return Promise.resolve(true);
    }

}
