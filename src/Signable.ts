import { getSchemaByType, SIGN_TYPE, SIGN_TYPES, TSignData } from './prepareTx';
import { Adapter } from './adapters';
import { ISignatureGeneratorConstructor, utils } from '@waves/signature-generator';


export class Signable {

    private readonly _forSign: TSignData;
    private readonly _adapter: Adapter;
    private readonly _bytePromise: Promise<Uint8Array>;
    private readonly _prepare: { sign: Function; api: Function };
    private readonly _signMethod: string;
    private _signPromise: Promise<string>;
    private _proofs: Array<string> = [];


    constructor(forSign: TSignData, adapter: Adapter) {
        this._forSign = forSign;
        this._adapter = adapter;
        this._prepare = getSchemaByType(forSign.type);

        if (this._forSign.data.proofs) {
            this._proofs = this._forSign.data.proofs.slice();
        }

        if (!this._prepare) {
            if (forSign.type !== SIGN_TYPE.CUSTOM) {
                throw new Error(`Can't find prepare api for tx type "${forSign.type}"!`);
            } else {
                this._prepare = {
                    sign: forSign.signProcessor || (data => data),
                    api: forSign.apiProcessor || (data => data)
                };
            }
        }

        let generator: ISignatureGeneratorConstructor<any>;
        if (forSign.type === SIGN_TYPE.CUSTOM) {
            generator = forSign.generator;
            this._signMethod = 'signRequest';
        } else {
            generator = SIGN_TYPES[forSign.type].signatureGenerator;
            this._signMethod = SIGN_TYPES[forSign.type].adapter;
        }

        if (!generator) {
            throw new Error(`Unknown data type ${forSign.type}!`);
        }

        this._bytePromise = Promise.all([
            this._adapter.getPublicKey(),
            this._adapter.getAddress()
        ]).then(([senderPublicKey, sender]) => {
            const dataForSign = this._prepare.sign({ sender, senderPublicKey, ...forSign.data });
            return new generator(dataForSign).getBytes();
        });
    }

    public getTxData() {
        return { ...this._forSign.data };
    }

    public async getSignData() {
        const senderPublicKey = await this._adapter.getPublicKey();
        const sender = await this._adapter.getAddress();
        return this._prepare.sign({ sender, senderPublicKey, ...this._forSign.data });
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
        return this._signPromise.then(() => this);
    }

    public getSignature(): Promise<string> {
        this._makeSignPromise();
        return this._signPromise;
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

    public addMyProof(): Promise<void> {
        return this.hasMySignature().then(hasMySignature => {
            if (!hasMySignature) {
                return this.getSignature().then(signature => {
                    this._proofs.push(signature);
                });
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
            return this._prepare.api({ senderPublicKey, sender, ...this._forSign.data, proofs });
        });
    }

    private _makeSignPromise(): Signable {
        if (!this._signPromise) {
            this._signPromise = this._bytePromise.then(bytes => {
                return this._adapter[this._signMethod](bytes, this._getAmountPrecision());
            });

            this._signPromise.catch(() => {
                this._signPromise = null;
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
