import { Seed, utils } from '@waves/signature-generator';
import { Asset, BigNumber, Money } from '@waves/data-entities';
import { SeedAdapter, SIGN_TYPE } from '../src/index';
import './WavesKeeperAdapter';
import './validators';


const testSeed = 'some test seed words without money on mainnet';
const seed = new Seed(testSeed);

//@ts-ignore
const checkCryptoGen = publicKey => (bytes, signature) => {
    return utils.crypto.isValidSignature(bytes, signature, publicKey);
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
    
    describe('invoke_script', () => {
        let adapter: SeedAdapter;
    
        beforeEach(() => {
            adapter = new SeedAdapter(testSeed);
        });
        it ('check', done => {
            const data = {
                payment: [Money.fromTokens(1, testAsset)] as [Money],
                fee: Money.fromTokens(0.0005, testAsset),
                dappAddress: '3PQwUzCLuAG24xV7Bd6AMWCz4GEXyDix8Dz',
                timestamp: Date.now(),
                call: {
                    function: 'trololo',
                    args: [ { value: 123, type: 'string' } ]
                }
            };
    
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.SCRIPT_INVOCATION,
                data
            });
    
            Promise.all([signable.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkCrypto(bytes, signature)).toBe(true);
                    done();
                });
            
        })
    });
    
    describe('Check signature', () => {
        
        let adapter: SeedAdapter;
        
        beforeEach(() => {
            adapter = new SeedAdapter(testSeed);
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
        
    });
});
