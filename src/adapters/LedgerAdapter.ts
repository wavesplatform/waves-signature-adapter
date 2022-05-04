import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { WavesLedger } from '@waves/ledger';
import { SIGN_TYPE } from '../prepareTx';


export class LedgerAdapter extends Adapter {

    //@ts-ignore
    private _currentUser;
    public static type = AdapterType.Ledger;
    //@ts-ignore
    private static _ledger: WavesLedger;
    //@ts-ignore
    private static _hasConnectionPromise;
    private static _wavesLedgerOptions: IWavesLedger;

    //@ts-ignore
    constructor(user) {
        super();
        this._currentUser = user;

        if (!this._currentUser) {
            throw 'No selected user';
        }

        this._isDestroyed = false;
    }

    public isAvailable() {
        return this._isMyLedger();
    }

    public getSyncAddress(): string {
        return this._currentUser.address;
    }

    public getSyncPublicKey(): string {
        return this._currentUser.publicKey;
    }

    public getPublicKey() {
        return Promise.resolve(this._currentUser.publicKey);
    }

    public getAddress() {
        return Promise.resolve(this._currentUser.address);
    }

    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }

    public getAdapterVersion() {
        return LedgerAdapter.getLedgerInstance().getVersion();
    }

    public signRequest(bytes: Uint8Array): Promise<string> {
        return  this._isMyLedger()
            .then(() => LedgerAdapter.getLedgerInstance().signRequest(this._currentUser.id, { dataBuffer: bytes }));
    }

    public signTransaction(bytes: Uint8Array, precision: Record<string, number>, signData: any): Promise<string> {
        if (bytes[0] === 15) {
            return this.signData(bytes);
        }
        return this._isMyLedger()
            .then(() => LedgerAdapter.getLedgerInstance().signTransaction(
                this._currentUser.id, {
                    amount2Precision: precision.amount2Precision,
                    amountPrecision: precision.amountPrecision,
                    feePrecision: precision.feePrecision,
                    dataType: signData.type,
                    dataVersion: signData.data.version,
                    dataBuffer: bytes
                }));
    }

    public signOrder(bytes: Uint8Array, precision: Record<string, number>, data: any): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter.getLedgerInstance().signOrder(this._currentUser.id, {
                dataBuffer: bytes,
                amountPrecision: precision.amountPrecision,
                feePrecision: precision.feePrecision,
                dataVersion: data.data.version
            }));
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter.getLedgerInstance().signSomeData(this._currentUser.id, { dataBuffer: bytes }));
    }

    public getEncodedSeed() {
        return Promise.reject(Error('Method "getEncodedSeed" is not available!'));
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public getSignVersions(): Record<SIGN_TYPE, Array<number>> {
        return {
            [SIGN_TYPE.AUTH]: [1],
            [SIGN_TYPE.MATCHER_ORDERS]: [1],
            [SIGN_TYPE.WAVES_CONFIRMATION]: [1],
            [SIGN_TYPE.CREATE_ORDER]: [1, 2, 3],
            [SIGN_TYPE.CANCEL_ORDER]: [1],
            [SIGN_TYPE.COINOMAT_CONFIRMATION]: [1],
            [SIGN_TYPE.ISSUE]: [2],
            [SIGN_TYPE.TRANSFER]: [2],
            [SIGN_TYPE.REISSUE]: [2],
            [SIGN_TYPE.BURN]: [2],
            [SIGN_TYPE.EXCHANGE]: [0,1,2],
            [SIGN_TYPE.LEASE]: [2],
            [SIGN_TYPE.CANCEL_LEASING]: [2],
            [SIGN_TYPE.CREATE_ALIAS]: [2],
            [SIGN_TYPE.MASS_TRANSFER]: [1],
            [SIGN_TYPE.DATA]: [1, 2],
            [SIGN_TYPE.SET_SCRIPT]: [1],
            [SIGN_TYPE.SPONSORSHIP]: [1],
            [SIGN_TYPE.SET_ASSET_SCRIPT]: [1],
            [SIGN_TYPE.SCRIPT_INVOCATION]: [1],
            [SIGN_TYPE.UPDATE_ASSET_INFO]: [1],
        };
    }

    protected _isMyLedger() {
        const promise = LedgerAdapter.getLedgerInstance().getUserDataById(this._currentUser.id)
            //@ts-ignore
            .then(user => {
                if (user.address !== this._currentUser.address) {
                    this._isDestroyed = true;
                    throw {error: 'Invalid ledger'};
                }
            });

        promise.catch((e: any) => {
            console.warn(e);
        });

        return promise;
    }

    public static getUserList(from: number = 1, to: number = 1) {
        return LedgerAdapter.getLedgerInstance().getPaginationUsersData(from, to) as any;
    }

    public static initOptions(options: IWavesLedger) {
        Adapter.initOptions(options);
        LedgerAdapter._wavesLedgerOptions = options;
    }

    public static isAvailable() {
        if (!LedgerAdapter._hasConnectionPromise) {
            LedgerAdapter._hasConnectionPromise = LedgerAdapter.getLedgerInstance().probeDevice();
        }

        return LedgerAdapter._hasConnectionPromise.then(() => {
            LedgerAdapter._hasConnectionPromise = null;
            return true;
            //@ts-ignore
        }, (err) => {
            LedgerAdapter._hasConnectionPromise = null;
            return false;
        });
    }

    protected static getLedgerInstance(): WavesLedger {
        if (!LedgerAdapter._ledger) {
            LedgerAdapter._ledger = new WavesLedger(LedgerAdapter._wavesLedgerOptions);
        }
        return LedgerAdapter._ledger;
    }
}

interface IWavesLedger  {
    networkCode: number;
    debug?: boolean;
    openTimeout?: number;
    listenTimeout?: number;
    exchangeTimeout?: number;
    //@ts-ignore
    transport?;
}
