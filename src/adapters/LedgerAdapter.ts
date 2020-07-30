import { Adapter } from './Adapter';
import { AdapterType, TX_VERSIONS } from '../config';
import { WavesLedger } from '@waves/ledger';

export class LedgerAdapter extends Adapter {

    //@ts-ignore
    private _currentUser;
    public static type = AdapterType.Ledger;
    //@ts-ignore
    private static _ledger;
    //@ts-ignore
    private static _hasConnectionPromise;


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
        return LedgerAdapter._ledger.getVersion();
    }

    public signRequest(bytes: Uint8Array): Promise<string> {
        return  this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signRequest(this._currentUser.id, bytes));
    }

    public signTransaction(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        if (bytes[0] === 15) {
            return this.signData(bytes);
        }
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signTransaction(this._currentUser.id, {precision: amountPrecision}, bytes));
    }

    public signOrder(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signOrder(this._currentUser.id, {precision: amountPrecision}, bytes));
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signSomeData(this._currentUser.id, bytes));
    }
    
    public getEncodedSeed() {
        return Promise.reject(Error('Method "getEncodedSeed" is not available!'));
    }
    
    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public getSignVersions() {
        return TX_VERSIONS;
    }

    protected _isMyLedger() {
        const promise = LedgerAdapter._ledger.getUserDataById(this._currentUser.id)
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

    public static getUserList(from: Number = 1, to: Number = 1) {
        return LedgerAdapter._ledger.getPaginationUsersData(from, to);
    }

    public static initOptions(options: IWavesLedger) {
        Adapter.initOptions(options);
        this._ledger = new WavesLedger( options );
    }

    public static isAvailable() {
        if (!LedgerAdapter._hasConnectionPromise) {
            LedgerAdapter._hasConnectionPromise = LedgerAdapter._ledger.probeDevice();
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
