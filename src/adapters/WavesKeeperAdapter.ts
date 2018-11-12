import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { SIGN_TYPE, TSignData } from '../prepareTx';
import { utils } from '@waves/signature-generator';

export class WavesKeeperAdapter extends Adapter {

    public static type = AdapterType.WavesKeeper;
    public static adapter: WavesKeeperAdapter;
    private static _onUpdateCb: Array<(...args) => any> = [];
    private _onDestoryCb = [];
    private _needDestroy = false;
    private _address: string;
    private _pKey: string;
    private static _api: IWavesKeeper;

    constructor( { address, publicKey }) {
        super();
        if (typeof WavesKeeperAdapter._api === 'undefined') {
            throw 'No plugin api';
        }

        if (!WavesKeeperAdapter._api.auth) {
            throw 'No plugin api';
        }

        this._address = address;
        this._pKey = publicKey;

        WavesKeeperAdapter.onUpdate((state) => {
            if (!state.account || state.account.address !== this._address) {
                this._needDestroy = true;
                this._onDestoryCb.forEach(cb => cb());
            }
        });
    }

    public async isAvailable(): Promise<void> {
        try {
            await WavesKeeperAdapter.isAvailable();
            const data = await WavesKeeperAdapter._api.publicState();
            if (data.account.address === this._address) {
                return Promise.resolve();
            }
        } catch (e) {
        }

        return Promise.reject(null);
    }
    
    public onDestroy(cb) {
        if (this._needDestroy) {
            return cb();
        }

        this._onDestoryCb.push(cb);
    }
    
    public getPublicKey() {
        return Promise.resolve(this._pKey);
    }

    public getAddress() {
        return Promise.resolve(this._address);
    }

    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }

    public async signRequest(bytes: Uint8Array, presision?, signData?): Promise<string> {
        const dataStr = await WavesKeeperAdapter._api.signRequest(signData);
        return dataStr;
    }

    public async signTransaction(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        const dataStr = await WavesKeeperAdapter._api.signTransaction(signData);
        const { proofs, signature } = JSON.parse(dataStr);
        return signature || proofs.pop();
    }

    public async signOrder(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        let promise;
        switch (signData.type) {
            case SIGN_TYPE.CREATE_ORDER:
                promise = WavesKeeperAdapter._api.signOrder(signData);
                break;
            case SIGN_TYPE.CANCEL_ORDER:
                promise = WavesKeeperAdapter._api.signCancelOrder(signData);
                break;
            default:
                return WavesKeeperAdapter._api.signRequest(signData);
        }

        const dataStr = await promise;
        const { proofs, signature } = JSON.parse(dataStr);
        return signature || proofs.pop();
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return Promise.resolve(''); //TODO
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public static async isAvailable() {
        if (!this._api) {
            throw { code: 0, message: 'Install WavesKeeper' };
        }

        let error, data;
        try {
            data = await this._api.publicState();
        } catch (e) {
            error = { code: 1, message: 'No permissions' }
        }

        if (!error && data) {
            if (!data.account) {
                error = { code: 2, message: 'No accounts in waveskeeper' };
            } else if (!data.account.address || !utils.crypto.isValidAddress(data.account.address)) {
                error = { code: 3, message: 'Selected network incorrect' };
            }
        }

        if (error) {
            throw error;
        }

        return true;
    }

    public static getUserList() {
        return WavesKeeperAdapter._api.publicState().then(({ account }) => [account]);
    }

    public static initOptions(options) {
        Adapter.initOptions(options);
        this.setApiExtension(options.extension);
    }

    public static setApiExtension(extension) {
        this._api = extension;
        WavesKeeperAdapter._api.on('update', (state) => {
            for (const cb of WavesKeeperAdapter._onUpdateCb) {
                cb(state);
            }
        });
    }
    
    public static onUpdate(cb) {
        WavesKeeperAdapter._onUpdateCb.push(cb);
    }
}


interface IWavesKeeper {
    auth: (data: IAuth) => Promise<IAuthData>;
    signTransaction: (data: TSignData) => Promise<any>;
    signOrder: (data) => Promise<any>;
    signCancelOrder: (data) => Promise<any>;
    signRequest: (data) => Promise<string>;
    signBytes: (data) => Promise<string>;
    publicState: () => Promise<any>;
    on: (name: string, cb) => Promise<any>;
}

interface IAuth {
    data: string;
    name: string;
    icon?: string;
    successPath?: string;
}

interface IAuthData {
    address: string;
    data: string;
    host: string;
    prefix: string;
    publicKey: string;
    signature: string;
}
