import { getValidateSchema, IAdapterSignMethods, SIGN_TYPE, SIGN_TYPES, TSignData, prepare } from './prepareTx';
import { currentFeeFactory, IFeeConfig, isEmpty, last } from './utils';
import { Adapter } from './adapters';
import { ERRORS } from './constants';
import { SignError } from './SignError';
import { libs } from '@waves/waves-transactions';
import { convert } from '@waves/money-like-to-node';
import { BigNumber } from '@waves/bignumber';

const { base58encode, blake2b, verifySignature } = libs.crypto;

export class Signable {
    
    public readonly type: SIGN_TYPE;
    private readonly _forSign: TSignData;
    private readonly _adapter: Adapter;
    private readonly _bytePromise: Promise<Uint8Array>;
    private readonly _signMethod: keyof IAdapterSignMethods = 'signRequest';
    private _signPromise: Promise<string> | undefined;
    private _preparedData: any;
    private _proofs: Array<string> = [];
    
    
    constructor(forSign: TSignData, adapter: Adapter) {
        const networkCode = adapter.getNetworkByte();
        this._forSign = { ...forSign };
        this.type = forSign.type;
        this._adapter = adapter;
        const prepareMap = getValidateSchema(networkCode)[forSign.type];
        
        if (!prepareMap) {
            throw new SignError(`Can't find prepare api for tx type "${forSign.type}"!`, ERRORS.UNKNOWN_SIGN_TYPE);
        }
        
        this._forSign.data.timestamp = new Date(this._forSign.data.timestamp || Date.now()).getTime();
        
        if (this._forSign.data.proofs) {
            this._proofs = this._forSign.data.proofs.slice();
        }
        
        const availableVersions = adapter.getSignVersions()[forSign.type];
        
        if (availableVersions.length === 0) {
            throw new SignError(`Can\'t sign data with type ${this.type}`, ERRORS.NO_SUPPORTED_VERSIONS);
        }
        
        if (isEmpty(this._forSign.data.version)) {
            this._forSign.data.version = last(availableVersions);
        }
        
        const version = this._forSign.data.version;
        
        if (!availableVersions.includes(version)) {
            throw new SignError(`Can\'t sign data with type "${this.type}" and version "${version}"`, ERRORS.VERSION_IS_NOT_SUPPORTED);
        }
        
        if (!SIGN_TYPES[forSign.type as SIGN_TYPE].getBytes[version]) {
            throw new SignError(`Can't find prepare api for tx type "${forSign.type}" with version ${version}!`, ERRORS.VERSION_IS_NOT_SUPPORTED);
        }
        
        this._signMethod = SIGN_TYPES[forSign.type].adapter;
        
        try {
            this._preparedData = prepare.signSchema(prepareMap)(this._forSign.data, true);
        } catch (e) {
            throw new SignError(e.message, ERRORS.VALIDATION_FAILED);
        }
        
        this._bytePromise = this.getSignData()
            .then(signData => SIGN_TYPES[forSign.type].getBytes[version](signData));
    }
    
    public async getFee(config: IFeeConfig, hasScript: boolean, smartAssetIdList?: Array<string>) {
        const currentFee = currentFeeFactory(config);
        const txData = await this.getSignData();
        const bytes = await this.getBytes();
        return currentFee(txData, bytes, hasScript, smartAssetIdList);
    }
    
    public getTxData(): TSignData['data'] {
        return { ...this._forSign.data };
    }
    
    public async getSignData() {
        const senderPublicKey = await this._adapter.getPublicKey();
        const sender = await this._adapter.getAddress();
        const dataForBytes = {
            ...this._preparedData,
            senderPublicKey,
            sender, ...this._forSign.data,
            type: this._forSign.type
        };
        const convert = SIGN_TYPES[this._forSign.type as SIGN_TYPE].toNode || null;
        const signData = convert && convert(dataForBytes, this._adapter.getNetworkByte());
        
        return signData || dataForBytes;
    }
    
    
    public sign2fa(options: ISign2faOptions): Promise<Signable> {
        const code = options.code;
        
        return this._adapter.getAddress()
            .then(address => {
                return options.request({
                    address,
                    code,
                    signData: this._forSign
                });
            })
            .then(signature => {
                this._proofs.push(signature);
                
                return this;
            });
    }
    
    public addProof(signature: string): Signable {
        if (this._proofs.indexOf(signature) !== -1) {
            this._proofs.push(signature);
        }
        
        return this;
    }
    
    public getHash() {
        return this._bytePromise.then(bytes => base58encode(blake2b(bytes)));
    }
    
    public getId(): Promise<string> {
        return this._bytePromise.then(bytes => {
            const byteArr = Array.from(bytes);
            
            if (bytes[0] === 10) {
                bytes = new Uint8Array([byteArr[0], ...byteArr.slice(36, -16)])
            }
            
            return base58encode(blake2b(bytes))
        });
    }
    
    public sign(): Promise<Signable> {
        this._makeSignPromise();
        return (this._signPromise as Promise<string>).then(() => this);
    }
    
    public getSignature(): Promise<string> {
        this._makeSignPromise();
        return (this._signPromise as Promise<string>);
    }
    
    public getBytes() {
        return this._bytePromise;
    }
    
    public getMyProofs(): Promise<Array<string>> {
        return Promise.all([
            this.getBytes(),
            this._adapter.getPublicKey()
        ]).then(([bytes, publicKey]) => {
            return this._proofs.filter(signature => {
                try {
                    return verifySignature(publicKey, bytes, signature);
                } catch (e) {
                    return false;
                }
            });
        });
    }
    
    public hasMySignature(): Promise<boolean> {
        return this.getMyProofs().then(proofs => !!proofs.length);
    }
    
    public addMyProof(): Promise<string> {
        return this.hasMySignature().then(hasMySignature => {
            if (!hasMySignature) {
                return this.getSignature().then(signature => {
                    this._proofs.push(signature);
                    return signature;
                });
            } else {
                return this.getMyProofs().then(list => list[list.length - 1]);
            }
        });
    }
    
    public async getDataForApi(): Promise<object> {
        const data = await this.getSignData();
        await this.addMyProof();
        const proofs = this._proofs.slice();
        return convert({ ...data, proofs }, (item) => new BigNumber(item as string));
    }
    
    private _makeSignPromise(): Signable {
        if (!this._signPromise) {
            this._signPromise = this._bytePromise.then(bytes => {
                return this._adapter[this._signMethod](bytes, this._getAmountPrecision(), this._forSign);
            });
            
            this._signPromise.catch(() => {
                this._signPromise = undefined;
            });
        }
        return this;
    }
    
    private _getAmountPrecision() {
        const data = this._forSign.data as any;
        return data.amount && data.amount.asset && data.amount.asset.precision ? data.amount.asset.precision : 0;
    }
    
}

export interface ISign2faOptions {
    code: string;
    
    request(data: any): Promise<string>;
}
