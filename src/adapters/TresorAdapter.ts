import { Adapter } from './Adapter';
import { AdapterType } from '../config';


export class TresorAdapter extends Adapter {

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

    public signRequest(bytes: Uint8Array): Promise<string> {
        return Promise.resolve(''); //TODO
    }

    public signTransaction(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return Promise.resolve(''); //TODO
    }

    public signOrder(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return Promise.resolve(''); //TODO
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return Promise.resolve(''); //TODO
    }

    public static isAvailable() {
        return Promise.resolve(false);
    }
}
