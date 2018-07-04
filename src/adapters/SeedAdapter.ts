import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { Seed, config, utils } from '@waves/waves-signature-generator';


export class SeedAdapter extends Adapter {

    private seed: Seed;
    public static type = AdapterType.Seed;


    constructor(phrase: string, networkByte: number) {
        super();
        config.set({ networkByte });
        this.seed = new Seed(phrase);
    }

    public getPublicKey() {
        return Promise.resolve(this.seed.keyPair.publicKey);
    }

    public getAddress() {
        return Promise.resolve(this.seed.address);
    }

    public getSeed() {
        return Promise.resolve(this.seed.phrase);
    }

    public sign(bytes: Uint8Array) {
        return Promise.resolve(utils.crypto.buildTransactionSignature(bytes, this.seed.keyPair.privateKey));
    }

    public static isAvailable() {
        return Promise.resolve(true);
    }
}
