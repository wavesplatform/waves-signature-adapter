import { generate as generateTxFactory, Long, Seed, StringWithLength, utils } from '@waves/signature-generator';
import { Asset, BigNumber, Money } from '@waves/data-entities';
import { SeedAdapter, SIGN_TYPE } from '../src/index';
import './WavesKeeperAdapter';
import './validators';


const testSeed = 'some test seed words without money on mainnet';
const seed = new Seed(testSeed);

const checkCryptoGen = publicKey => (bytes, signature) => {
    return utils.crypto.isValidSignature(bytes, signature, publicKey);
};

const checkRypto = checkCryptoGen(seed.keyPair.publicKey);

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
    ticker: null
});

describe('Create data and signature check', () => {
    
    
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
                    expect(checkRypto(bytes, signature)).toBe(true);
                    done();
                });
        });
        
        it('check custom signature', done => {
            
            const data = {
                prefix: 'some',
                timestamp: Date.now()
            };
            
            const generator = generateTxFactory([
                new StringWithLength('prefix'),
                new Long('timestamp')
            ]);
            
            const instance = new generator(data);
            
            const signable = adapter.makeSignable({
                type: SIGN_TYPE.CUSTOM,
                data,
                generator
            });
            
            Promise.all([instance.getBytes(), signable.getSignature()])
                .then(([bytes, signature]) => {
                    expect(checkRypto(bytes, signature)).toBe(true);
                    done();
                });
            
        });
        
    });
});
