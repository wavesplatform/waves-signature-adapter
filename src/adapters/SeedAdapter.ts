import { Adapter, IUser } from './Adapter';
import { AdapterType } from '../config';
import { seedUtils, libs } from '@waves/waves-transactions';
import { SIGN_TYPE } from '../prepareTx';

const Seed = seedUtils.Seed;
const signWithPrivateKey = libs.crypto.signBytes;

export class SeedAdapter extends Adapter {

    private seed: seedUtils.Seed;
    public static type = AdapterType.Seed;


    constructor(data: string | IUser, networkCode?: string | number) {
        super(networkCode);
        let seed;

        if (typeof data === 'string') {
            seed = data;
        } else {
            const user = <IUser>data;
            const encryptionRounds = user.encryptionRounds;
            seed = Seed.decryptSeedPhrase(user.encryptedSeed, user.password, encryptionRounds);
        }

        this.seed = new Seed(seed, String.fromCharCode(this.getNetworkByte()));
    }

    public getSignVersions(): Record<SIGN_TYPE, Array<number>> {
        return {
            [SIGN_TYPE.AUTH]: [1],
            [SIGN_TYPE.MATCHER_ORDERS]: [1],
            [SIGN_TYPE.CREATE_ORDER]: [1, 2, 3],
            [SIGN_TYPE.CANCEL_ORDER]: [1],
            [SIGN_TYPE.COINOMAT_CONFIRMATION]: [1],
            [SIGN_TYPE.ISSUE]: [2],
            [SIGN_TYPE.TRANSFER]: [2],
            [SIGN_TYPE.REISSUE]: [2],
            [SIGN_TYPE.BURN]: [2],
            [SIGN_TYPE.EXCHANGE]: [0, 2],
            [SIGN_TYPE.LEASE]: [2],
            [SIGN_TYPE.CANCEL_LEASING]: [2],
            [SIGN_TYPE.CREATE_ALIAS]: [2],
            [SIGN_TYPE.MASS_TRANSFER]: [1],
            [SIGN_TYPE.DATA]: [1],
            [SIGN_TYPE.SET_SCRIPT]: [1],
            [SIGN_TYPE.SPONSORSHIP]: [1],
            [SIGN_TYPE.SET_ASSET_SCRIPT]: [1],
            [SIGN_TYPE.SCRIPT_INVOCATION]: [1],
        };
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
        return Promise.resolve(signWithPrivateKey(bytes, this.seed.keyPair.privateKey));
    }

    public static isAvailable() {
        return Promise.resolve(true);
    }

}
