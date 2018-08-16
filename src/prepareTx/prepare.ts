import { Money, BigNumber } from '@waves/data-entities';
import { WAVES_ID, libs, config } from '@waves/waves-signature-generator';


export module prepare {

    export module processors {

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

        export function moneyToAssetId(money: Money): string {
            return money.asset.id;
        }

        export function moneyToNodeAssetId(money: Money): string {
            return idToNode(money.asset.id);
        }

        export function timestamp(time) {
            return (time && time instanceof Date ? time.getTime() : time) || Date.now();
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
            return () => value;
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

    export function idToNode(id: string): string {
        return id === WAVES_ID ? '' : id;
    }
}
