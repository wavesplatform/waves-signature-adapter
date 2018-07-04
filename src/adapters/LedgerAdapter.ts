import { Adapter } from './Adapter';
import { AdapterType } from '../config';


export class LedgerAdapter extends Adapter {

    public static type = AdapterType.MetaMask;

    public getPublicKey() {
        return Promise.resolve(''); // TODO
    }

    public getAddress() {
        return Promise.resolve(''); // TODO
    }

    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }

    public sign(bytes: Uint8Array) {
        return Promise.resolve(''); // TODO
    }

    public static isAvailable() {
        return Promise.resolve(false);
    }
}
