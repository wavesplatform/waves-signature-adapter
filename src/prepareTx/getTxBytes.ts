import { TSignData, getSchemaByType, SIGN_TYPES } from './';
import { ISignatureGeneratorConstructor } from '@waves/signature-generator';


export default function (forSign: TSignData): Promise<Uint8Array> {
    const prepare = getSchemaByType(forSign.type).sign;
    const dataForSign = prepare(forSign.data);
    //@ts-ignore
    const signatureGenerator = new (SIGN_TYPES[forSign.type].signatureGenerator as ISignatureGeneratorConstructor<any>)(dataForSign);

    return signatureGenerator.getBytes();
};
