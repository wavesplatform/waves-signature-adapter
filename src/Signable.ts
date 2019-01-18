import { getSchemaByType, IAdapterSignMethods, SIGN_TYPE, SIGN_TYPES, TSignData } from './prepareTx';
import { isEmpty, last } from './utils';
import { Adapter } from './adapters';
import { utils } from '@waves/signature-generator';
import { ERRORS } from './constants';
import { SignError } from './SignError';


export class Signable {

    public readonly type: SIGN_TYPE;
    private readonly _forSign: TSignData;
    private readonly _adapter: Adapter;
    private readonly _prepareForSing: Function;
    private readonly _bytePromise: Promise<Uint8Array>;
    private readonly _prepareForApi: Function | undefined;
    private readonly _signMethod: keyof IAdapterSignMethods = 'signRequest';
    private _signPromise: Promise<string> | undefined;
    private _proofs: Array<string> = [];


    constructor(forSign: TSignData, adapter: Adapter) {
        this._forSign = { ...forSign };
        this.type = forSign.type;
        this._adapter = adapter;
        const prepareMap = getSchemaByType(forSign.type);

        this._prepareForSing = prepareMap.sign;

        if (!prepareMap) {
            throw new SignError(`Can't find prepare api for tx type "${forSign.type}"!`, ERRORS.UNKNOWN_SIGN_TYPE);
        }

        if (!this._forSign.data.timestamp) {
            this._forSign.data.timestamp = Date.now();
        }

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

        this._prepareForApi = prepareMap.api[version];

        if (!this._prepareForApi) {
            throw new SignError(`Can't find prepare api for tx type "${forSign.type}" with version ${version}!`, ERRORS.VERSION_IS_NOT_SUPPORTED);
        }

        const generator = SIGN_TYPES[forSign.type].signatureGenerator[version];
        this._signMethod = SIGN_TYPES[forSign.type].adapter;

        if (!generator) {
            throw new Error(`Unknown data type ${forSign.type} with version ${version}!`);
        }

        try {
            this._prepareForSing(forSign.data, true);
        } catch (e) {
            throw new SignError(e.message, ERRORS.VALIDATION_FAILED);
        }

        this._bytePromise = Promise.all([
            this._adapter.getPublicKey(),
            this._adapter.getAddress()
        ]).then(([senderPublicKey, sender]) => {
            const dataForSign = this._prepareForSing({ sender, senderPublicKey, ...forSign.data });
            return new generator(dataForSign).getBytes();
        });
    }


    public getTxData(): TSignData['data'] {
        return { ...this._forSign.data };
    }

    public async getSignData() {
        const senderPublicKey = await this._adapter.getPublicKey();
        const sender = await this._adapter.getAddress();
        return this._prepareForSing({ sender, senderPublicKey, ...this._forSign.data });
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

    public getId(): Promise<string> {
        return this._bytePromise.then(utils.crypto.buildTransactionId);
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
                    return utils.crypto.isValidSignature(bytes, signature, publicKey);
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

    public getDataForApi(): Promise<object> {
        return Promise.all([
            this._adapter.getPublicKey(),
            this._adapter.getAddress(),
            this.addMyProof()
        ]).then(([senderPublicKey, sender]) => {
            const proofs = this._proofs.slice();
            const prepare = this._prepareForApi as Function;
            return prepare({ senderPublicKey, sender, ...this._forSign.data, proofs });
        });
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
