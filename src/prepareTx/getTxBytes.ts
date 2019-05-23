import { TSignData, SIGN_TYPES } from './';
import { getValidateSchema } from './schemas';
import { ISignatureGeneratorConstructor } from '@waves/signature-generator';


export default function (forSign: TSignData): Promise<Uint8Array> {
    debugger;
    const prepare = getValidateSchema(forSign.type) as any;
    const dataForSign = prepare(forSign.data) as any;
    //@ts-ignore
    const signatureGenerator = new (SIGN_TYPES[forSign.type].signatureGenerator as ISignatureGeneratorConstructor<any>)(dataForSign);

    return signatureGenerator.getBytes();
};
