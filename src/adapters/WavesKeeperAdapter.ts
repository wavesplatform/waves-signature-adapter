import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { SIGN_TYPE, TSignData, getSchemaByType } from '../prepareTx';
import { SIGN_TYPES } from '../prepareTx/constants';
import { utils } from '@waves/signature-generator';

const { isValidSignature } = utils.crypto;
const { sign } = getSchemaByType(SIGN_TYPE.AUTH);
const generator = SIGN_TYPES[SIGN_TYPE.AUTH].signatureGenerator;

declare const Waves: IWavesKeeper;

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
        
        WavesKeeperAdapter.adapter = new WavesKeeperAdapter(address, publicKey, extension);
        return WavesKeeperAdapter.adapter;
    }

    private _address: string;
    private _pKey: string;
    private _api: IWavesKeeper;
    
    constructor(address, pKey, api) {
        super();
        this._address = address;
        this._pKey = pKey;
        this._api = api;
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
        return this._api.signRequest(signData);
    
    }

    public signTransaction(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        return this._api.signTransaction(signData).then(
            ({ proofs, signature }) => signature || proofs.pop()
        );
    }

    public signOrder(bytes: Uint8Array, amountPrecision: number, signData): Promise<string> {
        switch (signData.type) {
            case SIGN_TYPE.CREATE_ORDER:
                return this._api.signOrder(signData).then(
                    ({ proofs, signature }) => signature || proofs.pop()
                );
            case SIGN_TYPE.CANCEL_ORDER:
                return this._api.signCancelOrder(signData).then(
                    ({ proofs, signature }) => signature || proofs.pop()
                );
        }
        
        return this._api.signRequest(signData);
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return Promise.resolve(''); //TODO
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    public static isAvailable() {
        return Promise.resolve(false);
    }
}


interface IWavesKeeper {
    sign: (data: IAuth) => Promise<IAuthData>;
    signTransaction: (data: TSignData) => Promise<any>;
    signOrder: (data) => Promise<any>;
    signCancelOrder: (data) => Promise<any>;
    signRequest: (data) => Promise<string>;
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
