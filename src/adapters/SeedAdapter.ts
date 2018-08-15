import { Adapter, IUser } from './Adapter';
import { AdapterType } from '../config';
import { Seed, config, utils } from '@waves/waves-signature-generator';


export class SeedAdapter extends Adapter {

    private seed: Seed;
    public static type = AdapterType.Seed;


    constructor(data: string | IUser) {
        super();
        let seed;

        if (typeof data === 'string') {
            seed = data;
        } else {
            const user = <IUser>data;
            const encryptionRounds = user.encryptionRounds;
            seed = Seed.decryptSeedPhrase(user.encryptedSeed, user.password, encryptionRounds);
        }

        this.seed = new Seed(seed);
    }

    public getPublicKey(): Promise<string> {
        return Promise.resolve(this.seed.keyPair.publicKey);
    }

    public getPrivateKey(): Promise<string> {
        return Promise.resolve(this.seed.keyPair.privateKey);
    }

    public getAddress(): Promise<string> {
        return Promise.resolve(this.seed.address);
    }

    public getSeed(): Promise<string> {
        return Promise.resolve(this.seed.phrase);
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
        return Promise.resolve(utils.crypto.buildTransactionSignature(bytes, this.seed.keyPair.privateKey));
    }

    public static isAvailable() {
        return Promise.resolve(true);
    }

}
