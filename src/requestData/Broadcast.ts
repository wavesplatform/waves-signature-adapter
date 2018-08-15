import { utils } from '@waves/waves-signature-generator';
import { SIGN_TYPES } from './constants';
import * as Interface from './interfaces';
import {ISignatureGeneratorConstructor} from "@waves/waves-signature-generator/src/signatureFactory/interface";


export function getSignatureBytes(forSign: Interface.TSignData, adapter, options?): Promise<string> {
    const signOptions = SIGN_TYPES[forSign.type];
    const signatureGenerator = <ISignatureGeneratorConstructor<any>>signOptions.signatureGenerator;
    const amountPrecision = options ? options.precision : 10;
    const instance = new signatureGenerator(forSign);
    return instance.getBytes()
        .then((bytes) => adapter[signOptions.adapter](bytes, amountPrecision));
}
