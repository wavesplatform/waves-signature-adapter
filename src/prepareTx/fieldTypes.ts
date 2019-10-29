//@ts-ignore
const fieldFactory = (type, optionalData?) => (fromField, toField = fromField, processor = null, optional = false) => ({
    name: fromField,
    field: toField || fromField,
    optional,
    processor,
    type,
    optionalData: optionalData,
});
export const string = (data?: any) => fieldFactory('string');
export const asset = (data?: any) => fieldFactory('assetId');
export const publicKey = (data?: any) => fieldFactory('publicKey');
export const assetName = (data?: any) => fieldFactory('assetName');
export const assetDescription = (data?: any) => fieldFactory('assetDescription');
export const precision = (data?: any) => fieldFactory('precision');
export const number = (data?: any) => fieldFactory('number');
export const address = (data: any) => fieldFactory('address', data);
export const aliasName = (data: any) => fieldFactory('aliasName', data);
export const aliasOrAddress = (data: any) => fieldFactory('aliasOrAddress', data);
export const money = (data?: any) => fieldFactory('money');
export const numberLike = (data?: any) => fieldFactory('numberLike');
export const attachment = (data?: any) => fieldFactory('attachment');
export const httpsUrl = (data?: any) => fieldFactory('httpsUrl');
export const timestamp = (data?: any) => fieldFactory('timestamp');
export const orderType = (data?: any) => fieldFactory('orderType');
export const fromData = (data?: any) => fieldFactory('fromData');
export const boolean = (data?: any) => fieldFactory('boolean');
export const transfers = (data?: any) => fieldFactory('transfers', data);
export const data = (data?: any) => fieldFactory('data');
export const script = (data?: any) => fieldFactory('script');
export const asset_script = (data?: any) => fieldFactory('asset_script');
export const required = (data?: any) => fieldFactory('required');
export const call = (data?: any) => fieldFactory('call');
export const payment = (data?: any) => fieldFactory('payment');
