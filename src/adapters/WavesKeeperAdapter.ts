import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { SIGN_TYPE, TSignData } from '../prepareTx';
import { isValidAddress } from '../prepareTx/fieldValidator';
import equals = require('ramda/src/equals');

const DEFAULT_TX_VERSIONS = {
    [SIGN_TYPE.AUTH]: [1],
    [SIGN_TYPE.MATCHER_ORDERS]: [1],
    [SIGN_TYPE.CREATE_ORDER]: [1, 2, 3],
    [SIGN_TYPE.CANCEL_ORDER]: [1],
    [SIGN_TYPE.COINOMAT_CONFIRMATION]: [1],
    [SIGN_TYPE.WAVES_CONFIRMATION]: [1],
    [SIGN_TYPE.ISSUE]: [2],
    [SIGN_TYPE.TRANSFER]: [2],
    [SIGN_TYPE.REISSUE]: [2],
    [SIGN_TYPE.BURN]: [2],
    [SIGN_TYPE.EXCHANGE]: [0,1,2],
    [SIGN_TYPE.LEASE]: [2],
    [SIGN_TYPE.CANCEL_LEASING]: [2],
    [SIGN_TYPE.CREATE_ALIAS]: [2],
    [SIGN_TYPE.MASS_TRANSFER]: [1],
    [SIGN_TYPE.DATA]: [1],
    [SIGN_TYPE.SET_SCRIPT]: [1],
    [SIGN_TYPE.SPONSORSHIP]: [1],
    [SIGN_TYPE.SET_ASSET_SCRIPT]: [1],
    [SIGN_TYPE.SCRIPT_INVOCATION]: [1]
};

export class WavesKeeperAdapter extends Adapter {

    public static type = AdapterType.WavesKeeper;
    public static adapter: WavesKeeperAdapter;
    private static _onUpdateCb: Array<(...args: Array<any>) => any> = [];
    private static _state: any;
    private _onDestoryCb = [];
    private _needDestroy = false;
    private _address: string;
    private _pKey: string;
    private static _txVersion: typeof DEFAULT_TX_VERSIONS = DEFAULT_TX_VERSIONS;
    private static _getApiCb: () => IWavesKeeper;

    private static _api: IWavesKeeper;

    private handleUpdate = (state: any) => {
        if (!state.locked && (!state.account || state.account.address !== this._address)) {
            this._needDestroy = true;
            this._isDestroyed = true;
            //@ts-ignore
            this._onDestoryCb.forEach(cb => cb());
            this._onDestoryCb = [];
            WavesKeeperAdapter.offUpdate(this.handleUpdate);
        }
    };

    constructor({ address, publicKey }: any, networkCode?: number|string) {
        super(networkCode);
        this._address = address;
        this._pKey = publicKey;
        WavesKeeperAdapter._initExtension();
        //@ts-ignore
        WavesKeeperAdapter.onUpdate(this.handleUpdate);
        this._isDestroyed = false;
    }

    public async isAvailable(ignoreLocked = false): Promise<void> {
        try {
            await WavesKeeperAdapter.isAvailable(this.getNetworkByte());
            const data = await WavesKeeperAdapter._api.publicState();
            WavesKeeperAdapter._updateState(data);

            if (data.locked) {
                return ignoreLocked ? Promise.resolve() : Promise.reject({ code: 4, msg: 'Keeper is locked' });
            }

            if (data.account && data.account.address === this._address) {
                return Promise.resolve();
            }
        } catch (e) {
        }

        return Promise.reject({ code: 5, msg: 'Keeper has another active account' });
    }

    public async isLocked() {
        await WavesKeeperAdapter.isAvailable();
        const data = await WavesKeeperAdapter._api.publicState();

        WavesKeeperAdapter._updateState(data);

        if (data.locked) {
            return Promise.resolve();
        }
    }

    public getSignVersions(): Record<SIGN_TYPE, Array<number>> {
        return WavesKeeperAdapter._txVersion;
    }

    //@ts-ignore
    public onDestroy(cb) {
        if (this._needDestroy) {
            return cb();
        }

        //@ts-ignore
        this._onDestoryCb.push(cb);
    }

    public getPublicKey() {
        return Promise.resolve(this._pKey);
    }

    public getAddress() {
        return Promise.resolve(this._address);
    }
    
    public getEncodedSeed() {
        return Promise.reject(Error('Method "getEncodedSeed" is not available!'));
    }
    
    
    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }

    //@ts-ignore
    public async signRequest(bytes: Uint8Array, _?, signData?): Promise<string> {
        await this.isAvailable(true);
        return await WavesKeeperAdapter._api.signRequest(WavesKeeperAdapter._serializedData(signData));
    }

    //@ts-ignore
    public async signTransaction(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        await this.isAvailable(true);
        const dataStr = await WavesKeeperAdapter._api.signTransaction(WavesKeeperAdapter._serializedData(signData));
        const { proofs, signature } = JSON.parse(dataStr);
        return signature || proofs.pop();
    }

    //@ts-ignore
    public async signOrder(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        await this.isAvailable(true);
        let promise;
        switch (signData.type) {
            case SIGN_TYPE.CREATE_ORDER:
                promise = WavesKeeperAdapter._api.signOrder(WavesKeeperAdapter._serializedData(signData));
                break;
            case SIGN_TYPE.CANCEL_ORDER:
                promise = WavesKeeperAdapter._api.signCancelOrder(WavesKeeperAdapter._serializedData(signData));
                break;
            default:
                return WavesKeeperAdapter._api.signRequest(WavesKeeperAdapter._serializedData(signData));
        }

        const dataStr = await promise;
        const { proofs, signature } = JSON.parse(dataStr);
        return signature || proofs.pop();
    }

    public async signData(bytes: Uint8Array): Promise<string> {
        await this.isAvailable(true);
        return Promise.resolve(''); //TODO
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public static async isAvailable(networkCode?: number) {
        await WavesKeeperAdapter._initExtension();

        if (!this._api) {
            throw { code: 0, message: 'Install WavesKeeper' };
        }

        if (!(networkCode || Adapter._code)) {
            throw { code: 5, message: 'Set adapter network code' };
        }

        let error, data;
        try {
            data = await this._api.publicState();
            WavesKeeperAdapter._updateState(data);

            if (data.txVersion) {
                WavesKeeperAdapter._txVersion = data.txVersion;
            }
        } catch (e) {
            error = { code: 1, message: 'No permissions' };
        }

        if (!error && data) {
            if (!data.account) {
                error = { code: 2, message: 'No accounts in waveskeeper' };
            } else if ((!data.account.address || !isValidAddress(data.account.address, networkCode || Adapter._code))) {
                error = { code: 3, message: 'Selected network incorrect' };
            }
        }

        if (error) {
            throw error;
        }

        return true;
    }

    public static async getUserList() {
        await WavesKeeperAdapter.isAvailable();
        return WavesKeeperAdapter._api.publicState().then((data) => {
            WavesKeeperAdapter._updateState(data);
            return [data.account];
        });
    }

    //@ts-ignore
    public static initOptions(options) {
        Adapter.initOptions(options);
        this.setApiExtension(options.extension);
        this._initExtension();
        try {
            this._api.publicState().then(WavesKeeperAdapter._updateState);
        } catch (e) {

        }
    }

    //@ts-ignore
    public static setApiExtension(extension) {

        let extensionCb;

        if (typeof extension === 'function') {
            extensionCb = extension;
        } else if (extension) {
            extensionCb = () => extension;
        }

        WavesKeeperAdapter._getApiCb = extensionCb;
    }

    public static onUpdate(cb: any) {
        WavesKeeperAdapter._onUpdateCb.push(cb);
    }

    public static offUpdate(func: any) {
        WavesKeeperAdapter._onUpdateCb = WavesKeeperAdapter._onUpdateCb.filter(f => f !== func)
    }

    private static _updateState(state: any) {
        if (equals(WavesKeeperAdapter._state, state)) {
            return;
        }
        
        for (const cb of WavesKeeperAdapter._onUpdateCb) {
            cb(state);
        }
    }

    private static _initExtension() {
        if (WavesKeeperAdapter._api || !WavesKeeperAdapter._getApiCb) {
            return WavesKeeperAdapter._api.initialPromise;
        }

        const wavesApi = WavesKeeperAdapter._getApiCb();
        if (wavesApi) {
           return wavesApi.initialPromise.then((api: IWavesKeeper) => {
                this._api = api;
                this._api.on('update', WavesKeeperAdapter._updateState);
                this._api.publicState().then(state => {

                    if (state.txVersion) {
                        WavesKeeperAdapter._txVersion = state.txVersion;
                    }

                    WavesKeeperAdapter._updateState(state);
                })
            });
        }
    }

    private static _serializedData(data: any) {
        return JSON.parse(
            JSON.stringify(data, (key, value) => value instanceof Uint8Array ? Array.from(value) : value)
        );
    }


}


interface IWavesKeeper {
    getSignVersions?: () => Record<SIGN_TYPE, Array<number>>;
    auth: (data: IAuth) => Promise<IAuthData>;
    signTransaction: (data: TSignData) => Promise<any>;
    signOrder: (data: any) => Promise<any>;
    signCancelOrder: (data: any) => Promise<any>;
    signRequest: (data: any) => Promise<string>;
    signBytes: (data: any) => Promise<string>;
    publicState: () => Promise<any>;
    on: (name: string, cb: any) => Promise<any>;
    initialPromise: Promise<IWavesKeeper>;
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
