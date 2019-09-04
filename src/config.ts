import { SeedAdapter } from './adapters/SeedAdapter';
import { LedgerAdapter } from './adapters/LedgerAdapter';
import { WavesKeeperAdapter } from './adapters';
import {PrivateKeyAdapter} from "./adapters/PrivateKeyAdapter";

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
