import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { WavesLedger } from '@waves/ledger';


export class LedgerAdapter extends Adapter {

    private _currentUser;
    public static type = AdapterType.Ledger;
    private static _ledger = new WavesLedger();
    private static _hasConnectionPromise;

    constructor(user) {
        super();
        this._currentUser = user;

        if (!this._currentUser) {
            throw 'No selected user';
        }
    }

    public isAvailable() {
        return LedgerAdapter.isAvailable();
    }

    public getPublicKey() {
        return Promise.resolve(this._currentUser.publicKey);
    }

    public getAddress() {
        return Promise.resolve(this._currentUser.wavesAddress);
    }

    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }

    public signRequest(bytes: Uint8Array): Promise<string> {
        return  this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signRequest(this._currentUser.id, bytes));
    }

    public signTransaction(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signTransaction(this._currentUser.id, bytes, {precision: amountPrecision}));
    }

    public signOrder(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signOrder(this._currentUser.id, bytes, {precision: amountPrecision}));
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signSomeData(this._currentUser.id, bytes));
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    protected _isMyLedger() {
        return LedgerAdapter._ledger.getUserDataById(this._currentUser.id)
            .then((user) => {
                if (user.wavesAddress !== this._currentUser.wavesAddress) {
                    throw {error: 'Invalid ledger'};
                }
            });
    }

    public static getUserList(from: Number = 1, to: Number = 1) {
        return LedgerAdapter._ledger.getPaginationUsersData(from, to);
    }

    public static isAvailable() {
        if (!LedgerAdapter._hasConnectionPromise) {
            LedgerAdapter._hasConnectionPromise = LedgerAdapter._ledger.probeDevice();
        }

        return LedgerAdapter._hasConnectionPromise.then(() => {
            LedgerAdapter._hasConnectionPromise = null;
            return true;
        }, (err) => {
            LedgerAdapter._hasConnectionPromise = null;
            return false;
        });
    }
}
