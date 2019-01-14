import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { WavesLedger } from '@waves/ledger';
import { SIGN_TYPE } from '../prepareTx';


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
    }

    public isAvailable() {
        return this._isMyLedger();
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

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public getSignVersions(): Record<SIGN_TYPE, Array<number>> {
        return {
            [SIGN_TYPE.AUTH]: [0],
            [SIGN_TYPE.MATCHER_ORDERS]: [0],
            [SIGN_TYPE.CREATE_ORDER]: [0, 2],
            [SIGN_TYPE.CANCEL_ORDER]: [0],
            [SIGN_TYPE.COINOMAT_CONFIRMATION]: [0],
            [SIGN_TYPE.ISSUE]: [2],
            [SIGN_TYPE.TRANSFER]: [2],
            [SIGN_TYPE.REISSUE]: [2],
            [SIGN_TYPE.BURN]: [2],
            [SIGN_TYPE.EXCHANGE]: [],
            [SIGN_TYPE.LEASE]: [2],
            [SIGN_TYPE.CANCEL_LEASING]: [2],
            [SIGN_TYPE.CREATE_ALIAS]: [2],
            [SIGN_TYPE.MASS_TRANSFER]: [1],
            [SIGN_TYPE.DATA]: [1],
            [SIGN_TYPE.SET_SCRIPT]: [1],
            [SIGN_TYPE.SPONSORSHIP]: [1],
            [SIGN_TYPE.SET_ASSET_SCRIPT]: [1],
        };
    }

    protected _isMyLedger() {
        return LedgerAdapter._ledger.getUserDataById(this._currentUser.id)
            //@ts-ignore
            .then(user => {
                if (user.address !== this._currentUser.address) {
                    throw {error: 'Invalid ledger'};
                }
            });
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
