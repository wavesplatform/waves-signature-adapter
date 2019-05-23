import { Asset, BigNumber, Money } from '@waves/data-entities';
import { SeedAdapter, SIGN_TYPE } from '../src/index';
import './WavesKeeperAdapter';
import { txs } from './transactionsData';
import { seedUtils } from '@waves/waves-transactions';
import { verifySignature } from '@waves/waves-crypto';
import './validators';

const { Seed } = seedUtils;

const testSeed = 'some test seed words without money on mainnet';
const seed = new Seed(testSeed);

const checkTx = (type: keyof typeof txs, version: number) => {
    const txData = (txs[type] as any)[version];
    const data = txData.data;
    return {
        name: `Test ${txData.name} v.${version} transaction.`,
        check: () => {
            const adapter = new SeedAdapter(testSeed);
            const signable = adapter.makeSignable({
                type,
                data:  { ...data, version } as any
            } as any);
            return Promise.all([signable.getBytes(), signable.getId(), signable.getSignData()])
                .then(([bytes, id, signedData]) => {
                    expect(checkCryptoGen(signedData.senderPublicKey)(bytes, txData.proof)).toBe(true);
                    expect(id).toEqual(txData.id);
                });
        }
    };
};

//@ts-ignore
const checkCryptoGen = publicKey => (bytes, signature) => {
    return verifySignature(publicKey, bytes, signature);
};

const checkCrypto = checkCryptoGen(seed.keyPair.publicKey);

const testAsset = new Asset({
    precision: 5,
    id: 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU',
    quantity: new BigNumber(10000),
    description: 'Some text',
    height: 100,
    name: 'Test',
    reissuable: false,
    sender: seed.address,
    timestamp: new Date(),
    ticker: undefined
});

describe('Create data and signature check', () => {
    
    describe('Check transactions', () => {
        
        let adapter: SeedAdapter;
        
        beforeEach(() => {
            adapter = new SeedAdapter(testSeed);
        });
    
        it('check issure signature', () => {
            return checkTx(SIGN_TYPE.ISSUE, 2).check();
        });
        
        it('check reissure signature', () => {
            return checkTx(SIGN_TYPE.REISSUE, 2).check();
        });
        
        it('check burn signature', () => {
            return checkTx(SIGN_TYPE.BURN, 2).check();
        });
        
        it('check transfer from node signature', () => {
            return checkTx(SIGN_TYPE.TRANSFER, 2).check();
        });
    
        it('check mass transfer from node signature', () => {
            return checkTx(SIGN_TYPE.MASS_TRANSFER, 1).check();
        });
        
        it('check exchange signature', done => {
            throw new Error('Not tested');
        });
        
        it('check sponsorship signature', done => {
            
            const data = {
                minSponsoredAssetFee: new Money(200000000, testAsset),
                fee: Money.fromTokens(0.001, testAsset),
                timestamp: Date.now()
            } as any;
            
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.SPONSORSHIP,
                data
            });
            
            Promise.all([signable.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkCrypto(bytes, signature)).toBe(true);
                    done();
                });
            
        });
        
        it('check transfer signature', done => {
            
            const data = {
                amount: Money.fromTokens(1, testAsset),
                fee: Money.fromTokens(0.0001, testAsset),
                recipient: 'send2',
                timestamp: Date.now()
            };
            
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.TRANSFER,
                data
            });
            
            Promise.all([signable.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkCrypto(bytes, signature)).toBe(true);
                    done();
                });
        });
        
        it('check lease signature', done => {
            
            const data = {
                recipient: 'test1',
                amount: new Money(200000000, testAsset),
                fee: Money.fromTokens(0.001, testAsset),
                timestamp: Date.now()
            } as any;
            
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.LEASE,
                data
            });
            
            Promise.all([signable.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkCrypto(bytes, signature)).toBe(true);
                    done();
                });
            
        });
        
        it('check cancel lease signature', done => {
            
            const data = {
                leaseId: 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU',
                fee: Money.fromTokens(0.001, testAsset),
                timestamp: Date.now()
            } as any;
            
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.CANCEL_LEASING,
                data
            });
            
            Promise.all([signable.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkCrypto(bytes, signature)).toBe(true);
                    done();
                });
            
        });
        
        it('check create alias signature', done => {
            
            const data = {
                alias: 'test1',
                fee: Money.fromTokens(0.001, testAsset),
                timestamp: Date.now()
            } as any;
            
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.CREATE_ALIAS,
                data
            });
            
            Promise.all([signable.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkCrypto(bytes, signature)).toBe(true);
                    done();
                });
            
        });
        
        it('check mass transfer signature', done => {
            
            const data = {
                totalAmount: Money.fromTokens(1, testAsset),
                fee: Money.fromTokens(0.0001, testAsset),
                transfers: [{ amount: 10, name: 'test1' }, { amount: 10, name: 'test2' }],
                timestamp: Date.now()
            } as any;
            
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.MASS_TRANSFER,
                data
            });
            
            Promise.all([signable.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkCrypto(bytes, signature)).toBe(true);
                    done();
                });
        });
    });
});
