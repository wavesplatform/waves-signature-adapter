import { WavesKeeperAdapter } from '../src/adapters/WavesKeeperAdapter';
import { Asset, Money } from '@waves/data-entities';
import { TRANSACTION_TYPE_NUMBER } from '../src/prepareTx';
import { BigNumber } from '@waves/bignumber';

const testAsset = new Asset({
    precision: 5,
    id: 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU',
    quantity: new BigNumber(10000),
    description: 'Some text',
    height: 100,
    name: 'Test',
    reissuable: false,
    sender: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
    timestamp: new Date(),
    ticker: undefined
});

const keeperMock = {
    //@ts-ignore
    auth: async (data) => ({
        'data': 'test',
        'prefix': 'WavesWalletAuthentication',
        'host': 'www.yandex.ru',
        'name': 'test',
        'address': '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
        'publicKey': '2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr',
        'signature': '3xvbSznhRTgDP5vMSoPpqwVf29hSdDQLFpdbtVaMHCyzuFFEgSodB7MXZTescxcYiVtR9wCgTGmZPWTApMVMg6qP'
    }),
    //@ts-ignore
    signTransaction: async data => {
        switch (data.type) {
            case TRANSACTION_TYPE_NUMBER.SPONSORSHIP:
            case TRANSACTION_TYPE_NUMBER.BURN:
            case TRANSACTION_TYPE_NUMBER.CANCEL_LEASING:
            case TRANSACTION_TYPE_NUMBER.CREATE_ALIAS:
            case TRANSACTION_TYPE_NUMBER.DATA:
            case TRANSACTION_TYPE_NUMBER.EXCHANGE:
            case TRANSACTION_TYPE_NUMBER.ISSUE:
            case TRANSACTION_TYPE_NUMBER.LEASE:
            case TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
            case TRANSACTION_TYPE_NUMBER.TRANSFER:
            case TRANSACTION_TYPE_NUMBER.REISSUE:
            case TRANSACTION_TYPE_NUMBER.SET_SCRIPT:
                break;
            default:
                throw new Error('invalid transaction');
        }
        return JSON.stringify({ proofs: ['test', 'realProof'] });
    },
    //@ts-ignore
    signOrder: async data => {
    },
    //@ts-ignore
    signCancelOrder: async data => {
    },
    //@ts-ignore
    signRequest: async data => {
    },
    publicState: async () => ({
        locked: false,
        account: {
            address: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
            publicKey: '2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr'
        }
    }),
    //@ts-ignore
    on: (key: string, cb) => {
    },
    initialPromise: Promise.reject(),
};

keeperMock.initialPromise = Promise.resolve(keeperMock) as any;

WavesKeeperAdapter.initOptions({ networkCode: 'W'.charCodeAt(0), extension: keeperMock });


describe('WavesKeeper adapter test', () => {

    it('Test connect to extension', async () => {
        try {
            const users = await WavesKeeperAdapter.getUserList();
            const adapter = new WavesKeeperAdapter(users[0]);
            await adapter.isAvailable();
        } catch (e) {
            console.error(e);
            expect('Fail create adapter').toBe('Done');
        }
    });

    it('Test connect to extension by cb', async () => {
        let mock: any = null;
        WavesKeeperAdapter.setApiExtension(() => mock);

        try {
            const users = await WavesKeeperAdapter.getUserList();
            const adapter = new WavesKeeperAdapter(users[0]);
            await adapter.isAvailable();
            expect('Fail init Adapter').toBe('Done');
        } catch (e) {
            mock = keeperMock;
        }

        try {
            const users = await WavesKeeperAdapter.getUserList();
            const adapter = new WavesKeeperAdapter(users[0]);
            await adapter.isAvailable();

        } catch (e) {
            expect('Fail create adapter').toBe('Done');
        }
    });

    it('Test sign transfer', async () => {

        const data = {
            type: 4,
            data: {
                fee: new Money(0.1, testAsset),
                amount: new Money(1, testAsset),
                recipient: 'test',
                attachment: '',
            }
        };

        try {
            WavesKeeperAdapter.setApiExtension(keeperMock);
            const users = await WavesKeeperAdapter.getUserList();
            const adapter = new WavesKeeperAdapter(users[0]);
            const signable = adapter.makeSignable(data as any);
            const result = await signable.getDataForApi() as any;
            expect(result.proofs[0]).toBe('realProof');
        } catch (e) {
            expect(e).toBe('Done');
        }
    });

    it('Test convert UInt8Array transfer', async () => {

        const data = {
            type: 4,
            data: {
                fee: new Money(0.1, testAsset),
                amount: new Money(1, testAsset),
                recipient: 'test',
                attachment: new Uint8Array([1,2,3,4]),
            }
        };

        try {
            WavesKeeperAdapter.setApiExtension(keeperMock);
            const users = await WavesKeeperAdapter.getUserList();
            const adapter = new WavesKeeperAdapter(users[0]);
            const signable = adapter.makeSignable(data as any);
            const result = await signable.getDataForApi() as any;
            expect(result.proofs[0]).toBe('realProof');
        } catch (e) {
            expect(e).toBe('Done');
        }
    });
});
