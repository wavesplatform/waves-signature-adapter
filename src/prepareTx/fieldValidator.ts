import { Money, BigNumber } from '@waves/data-entities';
import { utils, libs } from '@waves/signature-generator';
import { numberLike } from './fieldTypes';

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

const DATA = {
    DATA_TX_SIZE_WITHOUT_ENTRIES: 52,
    DATA_ENTRIES_BYTE_LIMIT: 140 * 1024 - 52,
};

const ERROR_MSG = {
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
    BASE64: 'field can be base64 string',
};

const isBase64 = (value) => {
    const regExp = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    return regExp.test(value);
};

const getBytesFromString = value => new Blob([value], { type: 'text/html' }).size;

const numberToString = (num) => typeof num === 'number' ? num.toString() : num;

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
    
    switch (true) {
        case !optional && !value:
            return error(options, ERROR_MSG.REQUIRED);
        case value && typeof value === 'string':
            return error(options, ERROR_MSG.WRONG_TYPE);
    }
};

const attachment = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    string(options);
    const { value } = options;
    
   if (value && getBytesFromString(value) > TRANSFERS.ATTACHMENT) {
      return error(options, ERROR_MSG.LARGE_FIELD);
    }
};

const number = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    
    if (value && new BigNumber(value).isNaN()) {
        return error(options, ERROR_MSG.WRONG_NUMBER);
    }
};

const boolean = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    
    if (value && typeof value !== 'boolean') {
        return error(options, ERROR_MSG.WRONG_BOOLEAN);
    }
};

const money = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    switch (true) {
        case value && !(value instanceof Money):
            return error(options, ERROR_MSG.WRONG_TYPE);
        case value && value instanceof Money && (<Money>value).getCoins().isNaN():
            return error(options, ERROR_MSG.WRONG_NUMBER);
    }
};

const numberLike = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    switch (true) {
        case value && value instanceof BigNumber && (<BigNumber>value).isNaN():
            return error(options, ERROR_MSG.WRONG_TYPE);
        case value && value instanceof Money && (<Money>value).getCoins().isNaN():
            return error(options, ERROR_MSG.WRONG_NUMBER);
        case value && new BigNumber(value).isNaN():
            return error(options, ERROR_MSG.WRONG_NUMBER);
    }
};

const aliasName = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;
    
    switch (true) {
        case value && typeof value !== 'string':
            return error(options, ERROR_MSG.WRONG_TYPE);
        case value && value.length < ALIAS.MIN_ALIAS_LENGTH:
            return error(options, ERROR_MSG.SMALL_FIELD);
        case value && value.length > ALIAS.MAX_ALIAS_LENGTH:
            return error(options, ERROR_MSG.LARGE_FIELD);
        case value && value.split('').every((char) => ALIAS.AVAILABLE_CHARS.includes(char)):
            return error(options, ERROR_MSG.WRONG_SYMBOLS);
    }
};

const address = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;
    const isValidAddress = (address) => {
        try {
            return utils.crypto.isValidAddress(address);
        } catch (e) {
            return false;
        }
    };
    
    switch (true) {
        case value && typeof value !== 'string':
            return error(options, ERROR_MSG.WRONG_TYPE);
        case value && value.length <= ALIAS.MAX_ALIAS_LENGTH:
            return error(options, ERROR_MSG.SMALL_FIELD);
        case value && value.length > ADDRESS.MAX_ADDRESS_LENGTH:
            return error(options, ERROR_MSG.LARGE_FIELD);
        case value && isValidAddress(value):
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
    
    if (value) {
        if (typeof value !== 'string') {
            return error(options, ERROR_MSG.WRONG_TYPE);
        }
        
        let isAssetId = false;
    
        try {
            isAssetId = libs.base58.decode(value).length !== 32;
        } catch (e) {
            isAssetId = false;
        }
    
        if (!isAssetId) {
            return error(options, ERROR_MSG.WRONG_ASSET_ID);
        }
    }
};

const timestamp = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    
    if (value && !(value instanceof Date || typeof value === 'number')) {
        return error(options, ERROR_MSG.WRONG_TIMESTAMP);
    }
};

const orderType = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    
    if (value && typeof value !== 'string') {
        return error(options, ERROR_MSG.WRONG_TYPE);
    }
    
    if ( value && value !== 'sell' && value !== 'buy') {
        return error(options, ERROR_MSG.WRONG_ORDER_TYPE);
    }
};

const assetName = (options: IFieldOptions) => {
    options = { ...options, value: numberToString(options.value) };
    required(options);
    const { value } = options;
    
    if (value) {
        if (typeof value !== 'string') {
            error(options, ERROR_MSG.WRONG_TYPE);
        }
    
        const bytesLength = getBytesFromString(value);
        
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
    
    if (value) {
        if (typeof value !== 'string') {
            error(options, ERROR_MSG.WRONG_TYPE);
        }
        
        const bytesLength = getBytesFromString(value);
        
        if (bytesLength > ASSETS.DESCRIPTION_MAX_BYTES) {
            error(options, ERROR_MSG.LARGE_FIELD);
        }
    }
};

const httpsUrl = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    
    const isNotUrl = (url) => {
        try {
            new URL(url);
            return false;
        } catch (e) {
            return true;
        }
    };
    
    switch (value) {
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
    
    const errors = (value || []).map(({ recipient, amount }, index) => {
        const dataErrors = [];
        
        try {
            number({ ...options, value: amount, name: `${options.name}:${index}:amount` });
        } catch (e) {
            dataErrors.push(e);
        }
        
        try {
            aliasOrAddress({ ...options, value: recipient, name: `${options.name}:${index}:recipient` });
        } catch (e) {
            dataErrors.push(e);
        }
        
        return dataErrors;
    }).filter(item => item.length);
    
    if (errors.length) {
        error(options, errors);
    }
};

const data = (options: IFieldOptions) => {
    required(options);
    const { value } = options;
    
    if (!Array.isArray(value)) {
        error(options, ERROR_MSG.WRONG_TYPE);
    }
    
    const errors = value.map(({ key, type, value }, index) => {
        const errorData = [];
        
        try {
            string({ ...options, value: key, name: `${options.name}:${index}:key`, optional: false });
        } catch (e) {
            errorData.push(e);
        }

        const itemOptions = { ...options, name: `${options.name}:${index}: value`, optional: true };
        
        try {
            switch (type) {
                case 'integer':
                    numberLike({ ...itemOptions, });
                    break;
                case 'boolean':
                    break;
                case 'binary':
                    break;
                case 'string':
                    break;
                default:
                    error({ ...options, value: key, name: `${options.name}:${index}:type`}, ERROR_MSG.WRONG_TYPE);
            }
        } catch(e) {
            errorData.push(e);
        }
        
    }).filter(item => item.length);
};

const script = (options: IFieldOptions) => {
    const { value = '' } = options;
    
    if (value && !isBase64(value.replace('base64:', ''))) {
        error(options, ERROR_MSG.BASE64);
    }
};

export const VALIDATORS = {
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
};


interface IFieldOptions {
    key: string;
    value: any;
    optional: boolean;
    type: string;
    name: string;
}
