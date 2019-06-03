import { SIGN_TYPE, SIGN_TYPES, TSignData } from './';
import { getValidateSchema } from './schemas';
import { prepare } from './prepare';



export default function (forSign: TSignData, networkByte: number): Uint8Array {
    const prepareMap = getValidateSchema(networkByte)[forSign.type];
    const version = forSign.data.version || Object.keys(SIGN_TYPES[forSign.type].getBytes).sort().pop();
    
    const dataForBytes = {
        ...prepare.signSchema(prepareMap)(forSign.data),
        ...forSign.data,
        version,
        type: forSign.type
    };
    
    const convert = SIGN_TYPES[forSign.type as SIGN_TYPE].toNode || null;
    const signData = convert && convert(dataForBytes, networkByte) || dataForBytes;
    return SIGN_TYPES[forSign.type as SIGN_TYPE].getBytes[Number(version)](signData);
};
