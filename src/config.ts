import { SeedAdapter } from './adapters/SeedAdapter';
import { LedgerAdapter } from './adapters/LedgerAdapter';
import { WavesKeeperAdapter } from './adapters';
import {PrivateKeyAdapter} from "./adapters/PrivateKeyAdapter";
import { SIGN_TYPE } from './prepareTx';

export const enum AdapterType {
    Seed = 'seed',
    PrivateKey = 'privateKey',
    WavesKeeper = 'wavesKeeper',
    Ledger = 'ledger',
    Tresor = 'tresor'
}

export const adapterPriorityList = [
    AdapterType.WavesKeeper,
    AdapterType.Ledger,
    AdapterType.Tresor,
    AdapterType.Seed,
    AdapterType.PrivateKey
];

export const adapterList = [
    SeedAdapter,
    LedgerAdapter,
    WavesKeeperAdapter,
    PrivateKeyAdapter
];


export const TX_VERSIONS: Record<SIGN_TYPE, Array<number>> = {
    [SIGN_TYPE.AUTH]: [1],
    [SIGN_TYPE.MATCHER_ORDERS]: [1],
    [SIGN_TYPE.CREATE_ORDER]: [1, 2, 3],
    [SIGN_TYPE.CANCEL_ORDER]: [0, 1],
    [SIGN_TYPE.COINOMAT_CONFIRMATION]: [1],
    [SIGN_TYPE.WAVES_CONFIRMATION]: [1],
    [SIGN_TYPE.TRANSFER]: [2, 3],
    [SIGN_TYPE.ISSUE]: [2, 3],
    [SIGN_TYPE.REISSUE]: [2, 3],
    [SIGN_TYPE.BURN]: [2, 3],
    [SIGN_TYPE.EXCHANGE]: [0, 1, 2, 3],
    [SIGN_TYPE.LEASE]: [2, 3],
    [SIGN_TYPE.CANCEL_LEASING]: [2, 3],
    [SIGN_TYPE.CREATE_ALIAS]: [2, 3],
    [SIGN_TYPE.MASS_TRANSFER]: [1, 2],
    [SIGN_TYPE.DATA]: [1, 2],
    [SIGN_TYPE.SET_SCRIPT]: [1, 2],
    [SIGN_TYPE.SPONSORSHIP]: [1, 2],
    [SIGN_TYPE.SET_ASSET_SCRIPT]: [1, 2],
    [SIGN_TYPE.SCRIPT_INVOCATION]: [1, 2]
};