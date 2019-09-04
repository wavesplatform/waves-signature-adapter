import { Adapter, IUser } from './Adapter';
import { AdapterType } from '../config';
import { seedUtils, libs } from '@waves/waves-transactions';
import { SIGN_TYPE } from '../prepareTx';

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
            const user = <IUser>data;
            const encryptionRounds = user.encryptionRounds;
            this.privateKey = seedUtils.Seed.decryptSeedPhrase(user.encryptedPrivateKey, user.password, encryptionRounds);
        }

        this.publicKey = publicKey({ privateKey: this.privateKey });
        this.address = address({ publicKey: this.publicKey }, this._code);
        this._isDestroyed = false;
    }

    public getSignVersions(): Record<SIGN_TYPE, Array<number>> {
        return {
            [SIGN_TYPE.AUTH]: [1],
            [SIGN_TYPE.MATCHER_ORDERS]: [1],
            [SIGN_TYPE.CREATE_ORDER]: [1, 2, 3],
            [SIGN_TYPE.CANCEL_ORDER]: [0, 1],
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


    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
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
