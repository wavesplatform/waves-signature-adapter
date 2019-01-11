

import { getSchemaByType, IAdapterSignMethods, SIGN_TYPE, SIGN_TYPES, TSignData } from './prepareTx';
import { isEmpty, last } from './utils';
import { Adapter } from './adapters';
import { utils } from '@waves/signature-generator';


export class Signable {

    public readonly type: SIGN_TYPE;
    private readonly _forSign: TSignData;
    private readonly _adapter: Adapter;
    private readonly _prepare: { sign: Function; api: Function };
    private readonly _bytePromise: Promise<Uint8Array>;
    private _signMethod: keyof IAdapterSignMethods = 'signRequest';
    private _signPromise: Promise<string> | undefined;
    private _proofs: Array<string> = [];


    constructor(forSign: TSignData, adapter: Adapter) {
        this._forSign = { ...forSign };
        this.type = forSign.type;
        this._adapter = adapter;
        this._prepare = getSchemaByType(forSign.type);

        if (!this._forSign.data.timestamp) {
            this._forSign.data.timestamp = Date.now();
        }

        if (this._forSign.data.proofs) {
            this._proofs = this._forSign.data.proofs.slice();
        }

        if (!this._prepare) {
            throw new Error(`Can't find prepare api for tx type "${forSign.type}"!`);
        }

        this._bytePromise = adapter.getSignVersions()
            .then(map => {
                const availableVersions = map[forSign.type];

                if (availableVersions.length === 0) {
                    throw new Error(`Can\'t sign data with type ${this.type}`);
                }

                if (isEmpty(this._forSign.data.version)) {
                    this._forSign.data.version = last(availableVersions);
                }

                const version = this._forSign.data.version;

                const generator = SIGN_TYPES[forSign.type].signatureGenerator[version];
                this._signMethod = SIGN_TYPES[forSign.type].adapter;

                if (!generator) {
                    throw new Error(`Unknown data type ${forSign.type} with version ${version}!`);
                }

                this._prepare.sign(forSign.data, true);

                return Promise.all([
                    this._adapter.getPublicKey(),
                    this._adapter.getAddress()
                ]).then(([senderPublicKey, sender]) => {
                    const dataForSign = this._prepare.sign({ sender, senderPublicKey, ...forSign.data });
                    return new generator(dataForSign).getBytes();
                });
            });
    }


    public getTxData(): TSignData['data'] {
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
            return this._prepare.api({ senderPublicKey, sender, ...this._forSign.data, proofs });
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
