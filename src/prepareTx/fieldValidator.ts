import { libs } from '@waves/waves-transactions';
import { Money } from '@waves/data-entities';
import { BigNumber } from '@waves/bignumber';

const { stringToBytes, base58Decode, keccak, blake2b } = libs.crypto;

const TRANSFERS = {
    ATTACHMENT: 140
};

const ALIAS = {
    AVAILABLE_CHARS: '-.0123456789@_abcdefghijklmnopqrstuvwxyz',
    MAX_ALIAS_LENGTH: 30,
    MIN_ALIAS_LENGTH: 4,
};

const ADDRESS = {
    MAX_ADDRESS_LENGTH: 45
};

const ASSETS = {
    NAME_MIN_BYTES: 4,
    NAME_MAX_BYTES: 16,
    DESCRIPTION_MAX_BYTES: 1000,
};

export const ERROR_MSG = {
    REQUIRED: 'field is required',
    WRONG_TYPE: 'field is wrong type',
    WRONG_NUMBER: 'field is not number',
    WRONG_TIMESTAMP: 'field is not timestamp',
    SMALL_FIELD: 'field is small',
    LARGE_FIELD: 'field is large',
    WRONG_SYMBOLS: 'field has wrong symbols',
    WRONG_ADDRESS: 'field is wrong address',
    WRONG_BOOLEAN: 'field is wrong boolean',
    WRONG_ASSET_ID: 'field is wrong assetId',
    WRONG_ORDER_TYPE: 'field is wrong order type. Field can be "buy" or "sell"',
    NOT_HTTPS_URL: 'field can be url with https protocol',
    BASE64: 'field can be base64 string with prefix "base64:"',
    EMPTY_BASE64: 'field can be not empty base64"',
    BASE58: 'field can be base58 string',
    PUB_KEY: 'field can be base58 publicKey',
    NULL_VALUE: 'field is not null'
};

export const isValidAddress = function (address: string, networkByte: number) {
    if (!address || typeof address !== 'string') {
        throw new Error('Missing or invalid address');
    }

    let addressBytes = base58Decode(address);

    if (addressBytes[0] !== 1 || addressBytes[1] !== networkByte) {
        return false;
    }

    let key = addressBytes.slice(0, 22);
    let check = addressBytes.slice(22, 26);
    let keyHash = keccak(blake2b(key)).slice(0, 4);

    for (var i = 0; i < 4; i++) {
        if (check[i] !== keyHash[i]) {
            return false;
        }
    }
    return true;
};

const isBase64 = (value: string): boolean => {
    if (value === '') {
        return true;
    }
    const regExp = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    return regExp.test(value);
};

//@ts-ignore
const getBytesFromString = value => {
    return stringToBytes(value);
};

//@ts-ignore
const numberToString = (num) => num && typeof num === 'number' ? num.toString() : num;

const error = ({ value, ...options }: IFieldOptions, message: string) => {
    const { name: field, type } = options;
    throw { value, field, type, message };
};

const required = (options: IFieldOptions) => {
    const { value, optional } = options;

    if (!optional && value == null) {
        error(options, ERROR_MSG.REQUIRED);
    }
};

const string = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value, optional } = options;

    if ((!optional && value == null) && (value != null && typeof value !== 'string')) {
        return error(options, ERROR_MSG.WRONG_TYPE);
    }
};

const attachment = (options: IFieldOptions) => {

    const { value } = options;

    if (value == null) {
        return;
    }

    if (typeof value === 'string' || typeof value === 'number') {

        string(options);

        switch (true) {
            case typeof value != 'string':
                error(options, ERROR_MSG.WRONG_TYPE);
                break;
            case getBytesFromString(value).length > TRANSFERS.ATTACHMENT:
                error(options, ERROR_MSG.LARGE_FIELD);
                break;
        }

        return;
    }

    if (typeof value === 'object') {

        switch (true) {
            case typeof value.length !== 'number' || value.length < 0:
                error(options, ERROR_MSG.WRONG_TYPE);
                break;
            case value.length > TRANSFERS.ATTACHMENT:
                error(options, ERROR_MSG.LARGE_FIELD);
                break;
        }

        return;
    }

    error(options, ERROR_MSG.WRONG_TYPE);
};

const number = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    if (value != null && new BigNumber(value).isNaN()) {
        return error(options, ERROR_MSG.WRONG_NUMBER);
    }
};

const boolean = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    if (value != null && typeof value !== 'boolean') {
        return error(options, ERROR_MSG.WRONG_BOOLEAN);
    }
};

const money = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    if (value == null) {
        return;
    }

    switch (true) {
        case !(value instanceof Money):
            return error(options, ERROR_MSG.WRONG_TYPE);
        case value instanceof Money && (<Money>value).getCoins().isNaN():
            return error(options, ERROR_MSG.WRONG_NUMBER);
    }
};

const numberLike = (options: IFieldOptions, min?: string | number, max?: string | number) => {
    required(options);
    const { value } = options;

    if (value == null) {
        return;
    }

    const checkInterval = (bigNumber: BigNumber) => {
        if (min != null) {
            if (bigNumber.lt(new BigNumber(min))) {
                error(options, ERROR_MSG.SMALL_FIELD);
            }
        }

        if (max != null) {
            if (bigNumber.gt(new BigNumber(max))) {
                error(options, ERROR_MSG.LARGE_FIELD);
            }
        }
    };

    switch (true) {
        case value instanceof BigNumber:
            if ((<BigNumber>value).isNaN()) {
                error(options, ERROR_MSG.WRONG_TYPE);
            }
            checkInterval(value);
            break;
        case value instanceof Money:

            const coins = (<Money>value).getCoins();

            if (coins.isNaN()) {
                error(options, ERROR_MSG.WRONG_NUMBER);
            }
            checkInterval(coins);
            break;
        case typeof value === 'string' && !value:
            error(options, ERROR_MSG.WRONG_NUMBER);
            break;
        case new BigNumber(value).isNaN():
            return error(options, ERROR_MSG.WRONG_NUMBER);
        default:
            checkInterval(new BigNumber(value));
    }
};

const isNull = (options: IFieldOptions) => {
    if (options.value !== null) {
        error(options, ERROR_MSG.NULL_VALUE);
    }
}

const aliasName = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;

    if (value == null) {
        return null;
    }

    switch (true) {
        case typeof value !== 'string':
            return error(options, ERROR_MSG.WRONG_TYPE);
        case value.length < ALIAS.MIN_ALIAS_LENGTH:
            return error(options, ERROR_MSG.SMALL_FIELD);
        case value.length > ALIAS.MAX_ALIAS_LENGTH:
            return error(options, ERROR_MSG.LARGE_FIELD);
        case !(value.split('').every((char: string) => ALIAS.AVAILABLE_CHARS.includes(char))):
            return error(options, ERROR_MSG.WRONG_SYMBOLS);
    }
};

const address = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;
    const validateAddress = (address: string) => {
        try {
            return isValidAddress(address, options.optionalData as number);
        } catch (e) {
            return false;
        }
    };

    if (value == null) {
        return null;
    }
    switch (true) {
        case typeof value !== 'string':
            return error(options, ERROR_MSG.WRONG_TYPE);
        case value.length <= ALIAS.MAX_ALIAS_LENGTH:
            return error(options, ERROR_MSG.SMALL_FIELD);
        case value.length > ADDRESS.MAX_ADDRESS_LENGTH:
            return error(options, ERROR_MSG.LARGE_FIELD);
        case !validateAddress(value):
            return error(options, ERROR_MSG.WRONG_ADDRESS);
    }
};

const aliasOrAddress = (options: IFieldOptions) => {
    try {
        aliasName(options);
    } catch (e) {
        address(options);
    }
};

const assetId = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;

    if (value == null) {
        return null;
    }


    if (typeof value !== 'string') {
        return error(options, ERROR_MSG.WRONG_TYPE);
    }

    let isAssetId = false;

    try {
        isAssetId = base58Decode(value.trim()).length === 32;
    } catch (e) {
        isAssetId = false;
    }

    if (!isAssetId && value !== 'WAVES') {
        return error(options, ERROR_MSG.WRONG_ASSET_ID);
    }
};

const timestamp = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    if (isNaN(value) || value && !(value instanceof Date || typeof value === 'number' || +value)) {
        if (typeof value !== 'string' || isNaN(Date.parse(value as string))) {
            return error(options, ERROR_MSG.WRONG_TIMESTAMP);
        }
    }
};

const orderType = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    if (value == null) {
        return null;
    }

    if (typeof value !== 'string') {
        return error(options, ERROR_MSG.WRONG_TYPE);
    }

    if (value !== 'sell' && value !== 'buy') {
        return error(options, ERROR_MSG.WRONG_ORDER_TYPE);
    }
};

const assetName = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;

    if (value != null) {
        if (typeof value !== 'string') {
            error(options, ERROR_MSG.WRONG_TYPE);
        }

        const bytesLength = getBytesFromString(value).length;

        if (bytesLength < ASSETS.NAME_MIN_BYTES) {
            error(options, ERROR_MSG.SMALL_FIELD);
        }

        if (bytesLength > ASSETS.NAME_MAX_BYTES) {
            error(options, ERROR_MSG.LARGE_FIELD);
        }
    }
};

const assetDescription = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;

    if (value != null) {
        if (typeof value !== 'string') {
            error(options, ERROR_MSG.WRONG_TYPE);
        }

        const bytesLength = getBytesFromString(value).length;
        if (bytesLength > ASSETS.DESCRIPTION_MAX_BYTES) {
            error(options, ERROR_MSG.LARGE_FIELD);
        }
    }
};

const precision = (options: IFieldOptions) => {
    required(options);
    numberLike(options, 0, 8);
};

const httpsUrl = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    const isNotUrl = (url: string) => {
        try {
            new URL(url);
            return false;
        } catch (e) {
            return true;
        }
    };

    if (value == null) {
        return null;
    }

    switch (true) {
        case typeof value !== 'string':
            error(options, ERROR_MSG.WRONG_TYPE);
            break;
        case value.indexOf('https://') === -1:
            error(options, ERROR_MSG.NOT_HTTPS_URL);
            break;
        case isNotUrl(value):
            error(options, ERROR_MSG.NOT_HTTPS_URL);
            break;

    }
};

const transfers = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    if (!Array.isArray(value)) {
        error(options, ERROR_MSG.WRONG_TYPE);
    }

    if (!options.optional && value.length === 0) {
        error(options, ERROR_MSG.REQUIRED);
    }

    //@ts-ignore
    const errors = (value || []).map(({ recipient, amount, name }, index) => {
        const dataErrors = [];

        try {
            numberLike({ ...options, value: amount, name: `${options.name}:${index}:amount`, optional: false });
        } catch (e) {
            dataErrors.push(e);
        }

        try {
            aliasOrAddress({
                ...options,
                value: recipient || name,
                name: `${options.name}:${index}:recipient`,
                optional: false
            });
        } catch (e) {
            dataErrors.push(e);
        }

        return dataErrors;
        //@ts-ignore
    }).filter(item => item.length);

    if (errors.length) {
        error(options, errors);
        error(options, errors);
    }
};

const data = (options: IFieldOptions, noKey?: boolean, isArgs?: boolean) => {
    required(options);
    const { value } = options;
    if (!Array.isArray(value)) {
        error(options, ERROR_MSG.WRONG_TYPE);
    }
    //@ts-ignore
    const errors = value.map(({ key, type, value }, index) => {
        if (!noKey) {
            try {
                string({ ...options, value: key, name: `${options.name}:${index}:key`, optional: false });
            } catch (e) {
                return e;
            }
        }
        const itemOptions = { ...options, name: `${options.name}:${index}:value`, optional: false, value };

        try {
            switch (type) {
                case 'integer':
                    numberLike(itemOptions);
                    break;
                case 'boolean':
                    boolean(itemOptions);
                    break;
                case 'binary':
                    binary(itemOptions);
                    break;
                case 'string':
                    string(itemOptions);
                    break;
                case undefined:
                    isNull(itemOptions);
                    break;
                case 'list':
                     if(isArgs) {
                         const listValues = {
                             ...itemOptions,
                             name: `${itemOptions.name}:list`,
                             value: itemOptions.value
                         };

                         if (listValues.value) {
                             data(listValues, true);
                             break;
                         }
                     }
                default:
                    error({ ...options, value: key, name: `${options.name}:${index}:type` }, ERROR_MSG.WRONG_TYPE);
            }
        } catch (e) {
            return e;
        }
        //@ts-ignore
    }).filter(item => item);

    if (errors.length) {
        error(options, errors);
    }
};

const binary = (options: IFieldOptions) => {
    const { value = '' } = options;

    if (value && !value.includes('base64:')) {
        error(options, ERROR_MSG.BASE64);
    }

    if (value && !isBase64(value.replace('base64:', ''))) {
        error(options, ERROR_MSG.BASE64);
    }
};

const publicKey = (options: IFieldOptions) => {
    required(options);

    const { value = '' } = options;

    if (!value || typeof value !== 'string') {
        error(options, ERROR_MSG.PUB_KEY);
    }
     let pk;
    try {
       pk = base58Decode(value);
    } catch (e) {
        error(options, ERROR_MSG.BASE58);
    }

    if (pk && pk.length === 32) {
        return void 0;
    }

    error(options, ERROR_MSG.PUB_KEY);
};


const script = (options: IFieldOptions) => {
    binary(options);
};

const asset_script = (options: IFieldOptions) => {
    const { value } = options;

    if (!value || !value.replace('base64:', '')) {
        error(options, ERROR_MSG.EMPTY_BASE64);
    }

    script(options);
};

const call = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    if (value == null) {
        return;
    }

    if (!value || typeof value !== 'object') {
        error(options, ERROR_MSG.WRONG_TYPE);
    }

    const functionValue = {
        key: 'call.function',
        value: value.function,
        optional: false,
        type: 'string',
        name: 'function'
    };

    string(functionValue);

    if (value.function === '') {
        error(functionValue, ERROR_MSG.REQUIRED);
    }

    const argsValue = {
        key: 'call.args',
        value: value.args,
        optional: true,
        type: 'args',
        name: 'args'
    };

    if (argsValue.value) {
        data(argsValue, true, true);
    }
};

const payment = (options: IFieldOptions) => {
    required(options);
    const { value } = options;

    if (typeof value !== 'object' || typeof value.length !== 'number' || !value.forEach) {
        error(options, ERROR_MSG.WRONG_TYPE);
    }

    const errors = (value || []).map((amount: any, index: number) => {
        const dataErrors = [];

        try {
            money({ ...options, value: amount, name: `${options.name}:${index}`, optional: false });
        } catch (e) {
            dataErrors.push(e);
        }

        return dataErrors;
    }).filter((item: any) => item.length);

    if (errors.length) {
        error(options, errors);
        error(options, errors);
    }
};

export const VALIDATORS: any = {
    string,
    number,
    required,
    numberLike,
    money,
    aliasName,
    address,
    boolean,
    assetId,
    timestamp,
    orderType,
    assetName,
    assetDescription,
    httpsUrl,
    attachment,
    transfers,
    aliasOrAddress,
    data,
    script,
    asset_script,
    binary,
    precision,
    call,
    payment,
    publicKey,
};


interface IFieldOptions {
    key: string;
    value: any;
    optional: boolean;
    type: string;
    name: string;
    optionalData?: number;
}
