import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { SIGN_TYPE, TSignData } from '../prepareTx';
import { utils } from '@waves/signature-generator';

export class WavesKeeperAdapter extends Adapter {

    public static type = AdapterType.WavesKeeper;
    public static adapter: WavesKeeperAdapter;
    private static _onUpdateCb: Array<(...args: Array<any>) => any> = [];
    private _onDestoryCb = [];
    private _needDestroy = false;
    private _address: string;
    private _pKey: string;
    private static _getApiCb: () => IWavesKeeper;

    private static _api: IWavesKeeper;

    constructor({ address, publicKey }: any) {
        super();
        WavesKeeperAdapter._initExtension();
        this._address = address;
        this._pKey = publicKey;

        //@ts-ignore
        WavesKeeperAdapter.onUpdate((state) => {
            if (!state.locked && (!state.account || state.account.address !== this._address)) {
                this._needDestroy = true;
                //@ts-ignore
                this._onDestoryCb.forEach(cb => cb());
            }
        });
    }

    public async isAvailable(ignoreLocked = false): Promise<void> {
        try {
            await WavesKeeperAdapter.isAvailable();
            const data = await WavesKeeperAdapter._api.publicState();

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

        if (data.locked) {
            return Promise.resolve();
        }
    }

    public getSignVersions(): Promise<Record<SIGN_TYPE, Array<number>>> {
        if (WavesKeeperAdapter._api.getSignVersions) {
            return WavesKeeperAdapter._api.getSignVersions();
        } else {
            return Promise.resolve({
                [SIGN_TYPE.AUTH]: [0],
                [SIGN_TYPE.MATCHER_ORDERS]: [0],
                [SIGN_TYPE.CREATE_ORDER]: [0],
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
                [SIGN_TYPE.SPONSORSHIP]: [1]
            });
        }
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

    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }

    //@ts-ignore
    public async signRequest(bytes: Uint8Array, _?, signData?): Promise<string> {
        await this.isAvailable(true);
        return await WavesKeeperAdapter._api.signRequest(signData);
    }

    //@ts-ignore
    public async signTransaction(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        await this.isAvailable(true);
        const dataStr = await WavesKeeperAdapter._api.signTransaction(signData);
        const { proofs, signature } = JSON.parse(dataStr);
        return signature || proofs.pop();
    }

    //@ts-ignore
    public async signOrder(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        await this.isAvailable(true);
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

    public async signData(bytes: Uint8Array): Promise<string> {
        await this.isAvailable(true);
        return Promise.resolve(''); //TODO
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public static async isAvailable() {
        WavesKeeperAdapter._initExtension();

        if (!this._api) {
            throw { code: 0, message: 'Install WavesKeeper' };
        }

        let error, data;
        try {
            data = await this._api.publicState();
        } catch (e) {
            error = { code: 1, message: 'No permissions' };
        }

        if (!error && data) {
            if (!data.locked && !data.account) {
                error = { code: 2, message: 'No accounts in waveskeeper' };
            } else if (!data.locked && (!data.account.address || !utils.crypto.isValidAddress(data.account.address))) {
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
        return WavesKeeperAdapter._api.publicState().then(({ account }) => [account]);
    }

    //@ts-ignore
    public static initOptions(options) {
        Adapter.initOptions(options);
        this.setApiExtension(options.extension);
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


    private static _initExtension() {
        if (WavesKeeperAdapter._api || !WavesKeeperAdapter._getApiCb) {
            return null;
        }

        this._api = WavesKeeperAdapter._getApiCb();

        if (this._api) {
            //@ts-ignore
            this._api.on('update', (state) => {
                for (const cb of WavesKeeperAdapter._onUpdateCb) {
                    cb(state);
                }
            });
        }
    }
}


interface IWavesKeeper {
    getSignVersions?: () => Promise<Record<SIGN_TYPE, Array<number>>>;
    auth: (data: IAuth) => Promise<IAuthData>;
    signTransaction: (data: TSignData) => Promise<any>;
    signOrder: (data: any) => Promise<any>;
    signCancelOrder: (data: any) => Promise<any>;
    signRequest: (data: any) => Promise<string>;
    signBytes: (data: any) => Promise<string>;
    publicState: () => Promise<any>;
    on: (name: string, cb: any) => Promise<any>;
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
