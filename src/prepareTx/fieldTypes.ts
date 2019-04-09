//@ts-ignore
const fieldFactory = type => (fromField, toField = fromField, processor = null, optional = false) => ({
    name: fromField,
    field: toField || fromField,
    optional,
    processor,
    type
});

export const string = fieldFactory('string');
export const asset = fieldFactory('assetId');
export const assetName = fieldFactory('assetName');
export const assetDescription = fieldFactory('assetDescription');
export const precision = fieldFactory('precision');
export const number = fieldFactory('number');
export const address = fieldFactory('address');
export const aliasName = fieldFactory('aliasName');
export const aliasOrAddress = fieldFactory('aliasOrAddress');
export const money = fieldFactory('money');
export const numberLike = fieldFactory('numberLike');
export const attachment = fieldFactory('attachment');
export const httpsUrl = fieldFactory('httpsUrl');
export const timestamp = fieldFactory('timestamp');
export const orderType = fieldFactory('orderType');
export const fromData = fieldFactory('fromData');
export const boolean = fieldFactory('boolean');
export const transfers = fieldFactory('transfers');
export const data = fieldFactory('data');
export const script = fieldFactory('script');
export const asset_script = fieldFactory('asset_script');
export const required = fieldFactory('required');
export const call = fieldFactory('call');
export const payment = fieldFactory('payment');
