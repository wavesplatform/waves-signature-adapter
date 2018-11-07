import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { SIGN_TYPE, TSignData, getSchemaByType } from '../prepareTx';
import { SIGN_TYPES } from '../prepareTx/constants';
import { utils } from '@waves/signature-generator';

const { isValidSignature } = utils.crypto;
const { sign } = getSchemaByType(SIGN_TYPE.AUTH);
const generator = SIGN_TYPES[SIGN_TYPE.AUTH].signatureGenerator;


export class WavesKeeperAdapter extends Adapter {

    public static type = AdapterType.WavesKeeper;
    public static adapter: WavesKeeperAdapter;
    
    public static async connect({ name, icon = null, data }, extension): Promise<WavesKeeperAdapter> {
         
        if (typeof extension === 'undefined') {
            return Promise.reject('No plugin api');
        }
        
        if (!extension.auth) {
            return Promise.reject('No plugin api');
        }
        
        data = data || `${name} Login ${Date.now()}`;
        const { address, publicKey, prefix, signature, host } = await extension.auth({ data, name, icon });
        
        const validateData = {
            prefix,
            host,
            data
        };
        
        const bytes = await new generator(sign(validateData)).getBytes();
        const isValid = await isValidSignature(bytes, signature, publicKey);
        
        if (!isValid) {
            return Promise.reject('Signature is invalid');
        }
        
        WavesKeeperAdapter._api = extension;
        WavesKeeperAdapter.adapter = new WavesKeeperAdapter(address, publicKey);
        return WavesKeeperAdapter.adapter;
    }

    private _address: string;
    private _pKey: string;
    private static _api: IWavesKeeper;
    
    constructor(address, pKey) {
        super();
        if (typeof WavesKeeperAdapter._api === 'undefined') {
            throw 'No plugin api';
        }
    
        if (!WavesKeeperAdapter._api.auth) {
            throw 'No plugin api';
        }
        
        this._address = address;
        this._pKey = pKey;
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

    public signRequest(bytes: Uint8Array, presision?, signData?): Promise<string> {
        return WavesKeeperAdapter._api.signRequest(signData);
    
    }

    public signTransaction(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        return WavesKeeperAdapter._api.signTransaction(signData).then(
            ({ proofs, signature }) => signature || proofs.pop()
        );
    }

    public signOrder(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        switch (signData.type) {
            case SIGN_TYPE.CREATE_ORDER:
                return WavesKeeperAdapter._api.signOrder(signData).then(
                    ({ proofs, signature }) => signature || proofs.pop()
                );
            case SIGN_TYPE.CANCEL_ORDER:
                return WavesKeeperAdapter._api.signCancelOrder(signData).then(
                    ({ proofs, signature }) => signature || proofs.pop()
                );
        }
        
        return WavesKeeperAdapter._api.signRequest(signData);
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return Promise.resolve(''); //TODO
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public static async isAvailable() {
        if (!!this._api) {
            throw { code: 0, message: 'Install WavesKeeper' };
        }
        
        const promise = this._api.publicState();
        
        try {
            const state = await promise;
            
            if (!state.account) {
                throw { code: 2, message: 'No accounts in waveskeeper' };
            }
    
            if (!utils.crypto.isValidAddress(state.account.address)) {
                throw { code: 3, message: 'Selected network incorrect' };
            }
        } catch (e) {
            throw { code: 1, message: 'No permissions' }
        }
        
        return true;
    }
    
    public static getUserList() {
        return WavesKeeperAdapter._api.publicState().then(({ account }) => [account]);
    }
    
    public static initOptions(options) {
        Adapter.initOptions(options);
        this._api = options.extension;
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
