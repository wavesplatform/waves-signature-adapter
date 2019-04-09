import { Money, BigNumber, AssetPair, OrderPrice } from '@waves/data-entities';
import { WAVES_ID, libs, config } from '@waves/signature-generator';
import { VALIDATORS } from './fieldValidator';

//@ts-ignore
const normalizeAssetId = id => id === WAVES_ID ? '' : id;

interface ICall { function: string, args?: Array<any> }

export module prepare {
    
    export module processors {
        
        export function callFunc(callData?: ICall|null): ICall {
            callData = callData || Object.create(null);
            return {
                function: callData && callData.function || '',
                args: callData && callData.args || [],
            };
        }
        
        export function payments(payments: Array<Money>) {
            return payments.map(pay => {
                return {
                    amount: toBigNumber(pay).toString(),
                    assetId: pay.asset.id
                }
            });
        }
        
        export function scriptProcessor(code: string): string | null {
            return !!(code || '').replace('base64:', '') ? code : null;
        }
        
        //@ts-ignore
        export function assetPair(data) {
            return {
                amountAsset: normalizeAssetId(data.amount.asset.id),
                priceAsset: normalizeAssetId(data.price.asset.id)
            };
        }
        
        //@ts-ignore
        export function signatureFromProof(proofs) {
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
        
        export function toSponsorshipFee(moeny: Money): BigNumber {
            const coins = moeny.getCoins();
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
        
        //@ts-ignore
        export function timestamp(time) {
            if (!(+time) && typeof time === 'string') {
                return Date.parse(time);
            }
            return time && time instanceof Date ? time.getTime() : time;
        }
        
        //@ts-ignore
        export function orString(data): string {
            return data || '';
        }
        
        //@ts-ignore
        export function noProcess(data) {
            return data;
        }
        
        //@ts-ignore
        export function recipient(data) {
            const code = String.fromCharCode(config.get('networkByte'));
            return data.length < 30 ? `alias:${code}:${data}` : data;
        }
        
        export function attachment(data: string) {
            data = data || '';
            const value = Uint8Array.from(libs.converters.stringToByteArray(data));
            return libs.base58.encode(Uint8Array.from(value));
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
            return new BigNumber(data.quantity).times(new BigNumber(10).pow(data.precision));
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
    export function signSchema(args: Array<{ name, field, processor, optional, type }>) {
        //@ts-ignore
        return (data, validate = false) => {
            const errors: Array<any> = [];
            const prepareData = args.map((item) => {
                    const wrapped = <IWrappedFunction>wrap(item.name, item.field, item.processor || processors.noProcess);
                    
                    const validateOptions = {
                        key: wrapped.to,
                        value: wrapped.from ? data[wrapped.from] : data,
                        optional: item.optional,
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
