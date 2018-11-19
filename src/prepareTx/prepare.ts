import { Money, BigNumber, AssetPair, OrderPrice } from '@waves/data-entities';
import { WAVES_ID, libs, config } from '@waves/signature-generator';
import { VALIDATORS } from './fieldValidator';

const normalizeAssetId = id => id === WAVES_ID ? '' : id;

export module prepare {

    export module processors {

        export function scriptProcessor(code: string): string | null {
            return !!(code || '').replace('base64:', '') ? code : null;
        }

        export function assetPair(data) {
            return {
                amountAsset: normalizeAssetId(data.amount.asset.id),
                priceAsset: normalizeAssetId(data.price.asset.id)
            };
        }

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

        export function toSponsorshipFee(moeny: Money): BigNumber {
            const coins = moeny.getCoins();
            if (coins.eq(0)) {
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

        export function timestamp(time) {
            if (!(+time) && typeof time === 'string') {
                return Date.parse(time);
            }
            return time && time instanceof Date ? time.getTime() : time;
        }

        export function orString(data) {
            return data || '';
        }

        export function noProcess(data) {
            return data;
        }

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

        export function expiration(date?) {
            return date || new Date().setDate(new Date().getDate() + 20);
        }

        export function transfers(recipient, amount) {
            return (transfers) => transfers.map((transfer) => ({
                recipient: recipient(transfer.recipient),
                amount: amount(transfer.amount)
            }));
        }

        export function quantity(data): BigNumber {
            return new BigNumber(data.quantity).times(new BigNumber(10).pow(data.precision));
        }

        export function base64(str): string {
            return (str || '').replace('base64:', '');
        }

        export function toOrderPrice(order) {
            const assetPair = new AssetPair(order.amount.asset, order.price.asset);
            const orderPrice = OrderPrice.fromTokens(order.price.toTokens(), assetPair);
            return orderPrice.getMatcherCoins();
        }
    }

    export function wrap(from: string, to: string, cb: any): IWrappedFunction {
        if (typeof cb != 'function') {
            return { from, to, cb: () => cb };
        }
        return { from, to, cb };
    }

    export interface IWrappedFunction {
        from: string;
        to: string;
        cb: Function;
    }

    export function schema(...args: Array<IWrappedFunction | string>) {
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

    export function signSchema(args: Array<{ name, field, processor, optional, type }>) {
        return (data, validate = false) => {
            const errors = [];
            const prepareData = args.map((item) => {
                const wrapped = <IWrappedFunction>wrap(item.name, item.field, item.processor || processors.noProcess);

                const validateOptions = {
                    key: wrapped.to,
                    value: wrapped.from ? data[wrapped.from] : data,
                    optional: item.optional,
                    type: item.type,
                    name: item.name,
                };
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
                throw errors;
            }

            return prepareData;
        };
    }

    export function idToNode(id: string): string {
        return id === WAVES_ID ? '' : id;
    }
}
