import { SeedAdapter } from '../src/adapters';
import { Asset, Money } from '@waves/data-entities';
import { SIGN_TYPE } from '../src/prepareTx';
import { ERROR_MSG } from '../src/prepareTx/fieldValidator';
import { BigNumber } from '@waves/bignumber';
import { seedUtils } from '@waves/waves-transactions';

const Seed = seedUtils.Seed;

const getError = (e: Error) => JSON.parse(e.message);

const testSeed = 'some test seed words without money on mainnet';
const seed = new Seed(testSeed);
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

describe('Check validators', () => {
    
    let adapter: SeedAdapter;
    
    beforeEach(() => {
        adapter = new SeedAdapter(testSeed);
    });
    
    describe('check order validations', () => {
        
        const data = {
            matcherPublicKey: 'AHLRHBJYtxwqjCcBYnFWeDco8hGJicWYrFd5yM5bWmNh',
            orderType: 'sell',
            price: Money.fromTokens('12.22', testAsset),
            amount: new Money('12.5', testAsset),
            matcherFee: Money.fromTokens('0.003', testAsset),
            expiration: Date.now(),
        };
        
        it('valid order', () => {
            const signData = {
                type: SIGN_TYPE.CREATE_ORDER,
                data: { ...data }
            } as any;
            
            expect(
                (() => {
                    const signable = adapter.makeSignable(signData);
                    signable.getDataForApi();
                    return true;
                })()
            ).toBe(true)
        });
        
        it('invalid order type', () => {
            const signData = {
                type: SIGN_TYPE.CREATE_ORDER,
                data: { ...data, orderType: 'none' }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_ORDER_TYPE);
                expect(e[0].field).toEqual('orderType');
            }
        });
        
        it('invalid order amount', () => {
            const signData = {
                type: SIGN_TYPE.CREATE_ORDER,
                data: { ...data, amount: '10' }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(3);
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
                expect(e[0].field).toEqual('amount');
            }
        });
    });
    
    describe('check transfer validations', () => {
        const data = {
            amount: Money.fromTokens(1, testAsset),
            fee: Money.fromTokens(0.0001, testAsset),
            recipient: 'send2',
            timestamp: Date.now(),
        };
        
        it('valid transfer', () => {
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data }
            } as any;
            
            expect(
                (() => (!!adapter.makeSignable(signData)))()
            ).toBe(true)
        });
    
        it('valid transfer bytes', () => {
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data, transfers: [2, 15, 40, 20] }
            } as any;
        
            expect(
                (() => (!!adapter.makeSignable(signData)))()
            ).toBe(true)
        });
    
        it('valid transfer UInt8 bytes', () => {
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data, transfers: new Uint8Array([2, 15, 40, 20]) }
            } as any;
        
            expect(
                (() => (!!adapter.makeSignable(signData)))()
            ).toBe(true)
        });
        
        it('invalid transfer amount', () => {
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data, amount: '' }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
                expect(e[0].field).toEqual('amount');
            }
        });
        
        it('invalid transfer fee', () => {
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data, fee: '' }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
                expect(e[0].field).toEqual('fee');
            }
        });
        
        it('invalid transfer attachment', () => {
            debugger;
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data, attachment: {} }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('attachment');
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
            }
        });
        
        it('invalid transfer recipient', () => {
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data, recipient: '3Mz9N7YPfZPWGd4yYaX6H53Gcgrq6ifYiH7' }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('recipient');
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_ADDRESS);
            }
        });
        
        it('invalid transfer timestamp', () => {
            const signData = {
                type: SIGN_TYPE.TRANSFER,
                data: { ...data, timestamp: '3Mz9N7YPfZPWGd4yYaX6H53Gcgrq6ifYiH7' }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('timestamp');
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TIMESTAMP);
            }
        });
    });
    
    describe('check mass-transfer validations', () => {
        
        const data = {
            amount: Money.fromTokens(1, testAsset),
            fee: Money.fromTokens(0.0001, testAsset),
            transfers: [{ amount: '1', recipient: 'test1' }],
            totalAmount: new Money(1, testAsset),
            timestamp: Date.now(),
        };
        
        it('valid mass transfer', () => {
            const signData = {
                type: SIGN_TYPE.MASS_TRANSFER,
                data: { ...data }
            } as any;
            
            expect(
                (() => !!adapter.makeSignable(signData))()
            ).toBe(true)
        });
        
        it('mass transfer invalid transfers required', () => {
            const signData = {
                type: SIGN_TYPE.MASS_TRANSFER,
                data: { ...data, transfers: null }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('transfers');
                expect(e[0].message).toEqual(ERROR_MSG.REQUIRED);
            }
        });
        
        it('mass transfer invalid transfers type', () => {
            const signData = {
                type: SIGN_TYPE.MASS_TRANSFER,
                data: { ...data, transfers: {} }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('transfers');
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
            }
        });
        
        it('mass transfer invalid transfers address and amount', () => {
            const signData = {
                type: SIGN_TYPE.MASS_TRANSFER,
                data: {
                    ...data, transfers: [
                        { amount: '', recipient: 'tes' },
                        { amount: '1', recipient: '3Mz9N7YPfZPWGd4yYaX6H53Gcgrq6ifYiH7' },
                    ]
                }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('transfers');
                
                expect(e[0].message.length).toEqual(2);
                expect(e[0].message[0].length).toEqual(2);
                expect(e[0].message[0][0].field).toEqual('transfers:0:amount');
                expect(e[0].message[0][0].message).toEqual(ERROR_MSG.WRONG_NUMBER);
                expect(e[0].message[0][1].field).toEqual('transfers:0:recipient');
                expect(e[0].message[0][1].message).toEqual(ERROR_MSG.SMALL_FIELD);
                
                expect(e[0].message[1].length).toEqual(1);
                expect(e[0].message[1][0].field).toEqual('transfers:1:recipient');
                expect(e[0].message[1][0].message).toEqual(ERROR_MSG.WRONG_ADDRESS);
            }
        });
    });
    
    describe('check issure validations', () => {
        
        const data = {
            name: 'test',
            fee: Money.fromTokens(1, testAsset),
            description: '',
            quantity: 100000,
            precision: 7,
            reissuable: true,
        };
        
        it('issure no script valid', () => {
            const signData = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data }
            } as any;
            
            expect(
                (() => !!adapter.makeSignable(signData))()
            ).toBe(true);
        });
        
        it('issure has script valid', () => {
            const signData = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data },
                script: 'base64:AbCd'
            } as any;
            
            expect(
                (() => !!adapter.makeSignable(signData))()
            ).toBe(true);
        });
        
        it('issure invalid name', () => {
            const signData = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data, name: 'P' }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('name');
                expect(e[0].message).toEqual(ERROR_MSG.SMALL_FIELD);
            }
            
            const signData2 = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data, name: 'японамама' }
            } as any;
            
            try {
                adapter.makeSignable(signData2);
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('name');
                expect(e[0].message).toEqual(ERROR_MSG.LARGE_FIELD);
            }
        });
        
        it('issure invalid description', () => {
            const signData = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data, description: {} }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('description');
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
            }
            
            const desc = (new Array(1002).join('T'));
            
            const signData2 = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data, description: desc }
            } as any;
            
            try {
                adapter.makeSignable(signData2);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('description');
                expect(e[0].message).toEqual(ERROR_MSG.LARGE_FIELD);
            }
        });
        
        it('issure invalid precision', () => {
            const signData = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data, precision: -1 }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('precision');
                expect(e[0].message).toEqual(ERROR_MSG.SMALL_FIELD);
            }
            
            const signData2 = {
                type: SIGN_TYPE.ISSUE,
                data: { ...data, precision: '10' }
            } as any;
            
            try {
                adapter.makeSignable(signData2);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].field).toEqual('precision');
                expect(e[0].message).toEqual(ERROR_MSG.LARGE_FIELD);
            }
        });
    });
    
    describe('check data validations', () => {
        
        const data = {
            fee: Money.fromTokens(0.003, testAsset),
            data: [
                { key: 'string', value: 'testVal', type: 'string' },
                { key: 'binary', value: 'base64:AbCd', type: 'binary' },
                { key: 'integer', value: '20', type: 'integer' },
                { key: 'boolean', value: false, type: 'boolean' },
            ],
        };
        
        it('valid data', () => {
            const signData = {
                type: SIGN_TYPE.DATA,
                data: { ...data }
            } as any;
            
            expect(
                (() => (!!adapter.makeSignable(signData)))()
            ).toBe(true)
        });
        
        it('invalid data', () => {
            const signData = {
                type: SIGN_TYPE.DATA,
                data: { ...data, data: {} }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
                expect(e[0].field).toEqual('data');
            }
        });
        
        it('invalid data binary', () => {
            const signData = {
                type: SIGN_TYPE.DATA,
                data: {
                    ...data, data: [
                        { key: 'binary', value: 'AbCd', type: 'binary' },
                    ]
                }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].message[0].message).toEqual(ERROR_MSG.BASE64);
                expect(e[0].message[0].field).toEqual('data:0:value');
            }
        });
        
        it('invalid data binary no base64', () => {
            const signData = {
                type: SIGN_TYPE.DATA,
                data: {
                    ...data, data: [
                        { key: 'binary', value: 'base64:AbC', type: 'binary' },
                    ]
                }
            } as any;
            
            try {
                adapter.makeSignable(signData);
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].message[0].message).toEqual(ERROR_MSG.BASE64);
                expect(e[0].message[0].field).toEqual('data:0:value');
            }
        });
        
        it('invalid data type', () => {
            const signData = {
                type: SIGN_TYPE.DATA,
                data: {
                    ...data, data: [
                        { key: 'custom', value: 'base64:AbCd', type: 'custom' },
                    ]
                }
            } as any;
            
            try {
                adapter.makeSignable(signData).getBytes().catch(e => {
                });
                expect('Fail').toBe('Done');
            } catch (error) {
                const e = getError(error);
                expect(e.length).toEqual(1);
                expect(e[0].message[0].message).toEqual(ERROR_MSG.WRONG_TYPE);
                expect(e[0].message[0].field).toEqual('data:0:type');
            }
        });
    });
    
});
