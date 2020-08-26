import { Adapter, IUser, ISeedUser } from './Adapter';
import { AdapterType } from '../config';
import { seedUtils, libs } from '@waves/waves-transactions';
import { SIGN_TYPE } from '../prepareTx';

const Seed = seedUtils.Seed;
const signWithPrivateKey = libs.crypto.signBytes;

export class SeedAdapter extends Adapter {

    public isEncoded: boolean = false;
    private readonly encodedSeed: string | null = null;
    private seed: seedUtils.Seed;
    public static type = AdapterType.Seed;


    constructor(data: string | IUser, networkCode?: string | number) {
        super(networkCode);
        let seed;

        if (typeof data === 'string') {
            seed = data;
        } else {
            const user = <ISeedUser>data;
            const encryptionRounds = user.encryptionRounds;
            seed = Seed.decryptSeedPhrase(user.encryptedSeed, user.password, encryptionRounds);
        }

        try {
            if (/^base58:/.test(seed)) {
                const encodedSeed = seed.replace('base58:', '');
                try {
                    const decodedSeed = libs.crypto.bytesToString(libs.crypto.base58Decode(encodedSeed));
                    if (libs.crypto.base58Encode(libs.crypto.stringToBytes(decodedSeed)) !== encodedSeed) {
                        throw new Error('Can\'t decode seed to string');
                    }
                    seed = decodedSeed;
                }
                 catch (e) {
                    seed = libs.crypto.base58Decode(encodedSeed);
                }
                this.encodedSeed = encodedSeed;
                this.isEncoded = true;
            }
        } catch (e) {
        }

        if (!this.encodedSeed) {
            this.encodedSeed = libs.crypto.base58Encode(libs.crypto.stringToBytes(seed as string));
        }


        this.seed = {
            encrypt: (password: string, encryptionRounds?: number) => {
                return Seed.encryptSeedPhrase(`base58:${this.encodedSeed}`, password, encryptionRounds)
            },
            address: libs.crypto.address(seed, networkCode || this.getNetworkByte()),
            keyPair: {
                privateKey: libs.crypto.privateKey(seed),
                publicKey: libs.crypto.publicKey(seed)
            },
            phrase: typeof seed === 'string' ? seed : '',
        };

        Object.freeze(this.seed.keyPair);
        Object.freeze(this.seed);

        this._isDestroyed = false;
    }

    public getSignVersions(): Record<SIGN_TYPE, Array<number>> {
        return {
            [SIGN_TYPE.AUTH]: [1],
            [SIGN_TYPE.MATCHER_ORDERS]: [1],
            [SIGN_TYPE.CREATE_ORDER]: [1, 2, 3],
            [SIGN_TYPE.CANCEL_ORDER]: [0, 1],
            [SIGN_TYPE.COINOMAT_CONFIRMATION]: [1],
            [SIGN_TYPE.WAVES_CONFIRMATION]: [1],
            [SIGN_TYPE.TRANSFER]: [3, 2],
            [SIGN_TYPE.ISSUE]: [3, 2],
            [SIGN_TYPE.REISSUE]: [3, 2],
            [SIGN_TYPE.BURN]: [3, 2],
            [SIGN_TYPE.EXCHANGE]: [0, 1, 3, 2],
            [SIGN_TYPE.LEASE]: [3, 2],
            [SIGN_TYPE.CANCEL_LEASING]: [3, 2],
            [SIGN_TYPE.CREATE_ALIAS]: [3, 2],
            [SIGN_TYPE.MASS_TRANSFER]: [2, 1],
            [SIGN_TYPE.DATA]: [2, 1],
            [SIGN_TYPE.SET_SCRIPT]: [2, 1],
            [SIGN_TYPE.SPONSORSHIP]: [2, 1],
            [SIGN_TYPE.SET_ASSET_SCRIPT]: [2, 1],
            [SIGN_TYPE.SCRIPT_INVOCATION]: [2, 1],
            [SIGN_TYPE.UPDATE_ASSET_INFO]: [1]
        };
    }

    public getEncodedSeed(): Promise<string> {
        return Promise.resolve(this.encodedSeed as string);
    }

    public getSyncAddress(): string {
        return this.seed.address;
    }

    public getSyncPublicKey(): string {
        return this.seed.keyPair.publicKey;
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
        return typeof this.seed.phrase === 'string' ? Promise.resolve(this.seed.phrase) : Promise.reject(this.seed.phrase);
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
        return Promise.resolve(signWithPrivateKey(this.seed.keyPair, bytes));
    }

    public static isAvailable() {
        return Promise.resolve(true);
    }

}
