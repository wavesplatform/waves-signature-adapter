import { Money, AssetPair, OrderPrice } from '@waves/data-entities';
import { BigNumber } from '@waves/bignumber';
import { libs } from '@waves/waves-transactions';
import { VALIDATORS } from './fieldValidator';

export const WAVES_ID = 'WAVES';
const { stringToBytes, base58Encode } = libs.crypto;


//@ts-ignore
const normalizeAssetId = id => id === WAVES_ID ? '' : id;

interface ICall { function: string, args?: Array<any> }

export module prepare {
    
    export module processors {
        
        export function callFunc(callData?: ICall|null): ICall|null {
            if (!callData) {
                return null;
            }
            
            return {
                function: callData && callData.function || '',
                args: callData && callData.args || [],
            };
        }
        
        export function payments(payments: Array<Money>) {
            return (payments || []).map(pay => {
                return {
                    amount: toBigNumber(pay).toString(),
                    assetId: moneyToNodeAssetId(pay)
                }
            });
        }
        
        export function paymentsToNode(payments: Array<Money>) {
            return (payments || []).map(pay => {
                return {
                    amount: toBigNumber(pay),
                    assetId: moneyToNodeAssetId(pay) || null,
                }
            });
        }
        
        export function scriptProcessor(code: string): string | null {
            return !!(code || '').replace('base64:', '') ? code : null;
        }
        
        export function assetPair(data: any) {
            return {
                amountAsset: normalizeAssetId(data.amount.asset.id),
                priceAsset: normalizeAssetId(data.price.asset.id)
            };
        }
        
        export function signatureFromProof(proofs: any) {
            return proofs[0];
        }
        
        export function toBigNumber(some: string | number | BigNumber | Money): BigNumber {
            switch (typeof some) {
                case 'string':
                case 'number':
                    return new BigNumber(some as string);
                case 'object':
                    if (some instanceof BigNumber) {
                        return some;
                    } else {
                        return (some as Money).getCoins();
                    }
            }
        }
        
        export function toNumberString(some: any) {
            return toBigNumber(some).toString();
        }
        
        export function toSponsorshipFee(money: Money): BigNumber {
            const coins = money.getCoins();
            if (coins.eq(0)) {
                //@ts-ignore
                return null;
            } else {
                return coins;
            }
        }
        
        export function moneyToAssetId(money: Money): string {
            return money.asset.id;
        }
        
        export function moneyToNodeAssetId(money: Money): string {
            return idToNode(money.asset.id);
        }
        
        export function timestamp(time: string|number|Date) {
            if (!(+time) && typeof time === 'string') {
                return Date.parse(time);
            }
            return time && time instanceof Date ? time.getTime() : time;
        }
        
        export function orString(data: any | string): string {
            return data || '';
        }
        
        export function noProcess<T>(data: T): T {
            return data;
        }
        
        //@ts-ignore
        export const recipient = networkByte => data => {
            return data.length <= 30 ? `alias:${networkByte}:${data}` : data;
        };
        
        export function attachment(data: string | Array<number> | Uint8Array) {
            data = data || '';
            let value = data;
            
            if (typeof data === 'string') {
                value = stringToBytes(data);
            }
            
            return base58Encode(Uint8Array.from(value as ArrayLike<number>));
        }
        
        export function addValue(value: any) {
            return typeof value === 'function' ? value : () => value;
        }
        
        //@ts-ignore
        export function expiration(date?) {
            return date || new Date().setDate(new Date().getDate() + 20);
        }
        
        //@ts-ignore
        export function transfers(recipient, amount) {
            //@ts-ignore
            return (transfers) => transfers.map((transfer) => ({
                recipient: recipient(transfer.recipient),
                amount: amount(transfer.amount)
            }));
        }
        
        //@ts-ignore
        export function quantity(data): BigNumber {
            return new BigNumber(data.quantity).mul(new BigNumber(10).pow(data.precision));
        }
        
        //@ts-ignore
        export function base64(str): string {
            return (str || '').replace('base64:', '');
        }
        
        //@ts-ignore
        export function toOrderPrice(order) {
            const assetPair = new AssetPair(order.amount.asset, order.price.asset);
            const orderPrice = OrderPrice.fromTokens(order.price.toTokens(), assetPair);
            return orderPrice.getMatcherCoins();
        }
    }
    
    export function wrap(from: string | null, to: string, cb: any): IWrappedFunction {
        if (typeof cb != 'function') {
            //@ts-ignore
            return { from, to, cb: () => cb };
        }
        //@ts-ignore
        return { from, to, cb };
    }

    const findValue = (fromKey: string | string[], data: Record<string, string>) => {
        if (!Array.isArray(fromKey)) {
            return data[fromKey];
        }
        return data[fromKey.find(key => data[key]) || fromKey[0]];
    }

    export interface IWrappedFunction {
        from: string;
        to: string;
        cb: Function;
    }
    
    export function schema(...args: Array<IWrappedFunction | string>) {
        //@ts-ignore
        return (data) => args.map((item) => {
                return typeof item === 'string' ? {
                    key: item,
                    value: processors.noProcess(data[item])
                } : {
                    key: item.to,
                    value: item.cb(item.from ? data[item.from] : data)
                };
            })
            .reduce((result, item) => {
                result[item.key] = item.value;
                return result;
            }, Object.create(null));
    }
    
    //@ts-ignore
    export function signSchema(args: Array<{ name, field, processor, optional, type, optionalData }>) {
        //@ts-ignore
        return (data, validate = false) => {
            const errors: Array<any> = [];
            const prepareData = args.map((item) => {
                    const wrapped = <IWrappedFunction>wrap(item.name, item.field, item.processor || processors.noProcess);
                    const value = wrapped.from ? findValue(wrapped.from, data) : data;

                    const validateOptions = {
                        key: wrapped.to,
                        value: value,
                        optional: item.optional,
                        optionalData: item.optionalData,
                        type: item.type,
                        name: item.name,
                    };
                    //@ts-ignore
                    const validator = VALIDATORS[validateOptions.type];
                    try {
                        if (validate && validator) {
                            validator(validateOptions);
                        }
                        return {
                            key: validateOptions.key,
                            value: wrapped.cb(validateOptions.value),
                        };
                    } catch (e) {
                        errors.push(e);
                    }
                    
                    return {
                        key: validateOptions.key,
                        value: null,
                    };
                })
                .reduce((result, { key, value }) => {
                    result[key] = value;
                    return result;
                }, Object.create(null));
            
            if (errors.length) {
                throw new Error(JSON.stringify(errors));
            }
            
            return prepareData;
        };
    }
    
    export function idToNode(id: string): string {
        return id === WAVES_ID ? '' : id;
    }
}
