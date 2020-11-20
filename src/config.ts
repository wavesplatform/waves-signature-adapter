import { SeedAdapter } from './adapters/SeedAdapter';
import { LedgerAdapter } from './adapters/LedgerAdapter';
import { CustomAdapter, WavesKeeperAdapter } from './adapters';
import {PrivateKeyAdapter} from "./adapters/PrivateKeyAdapter";

export const enum AdapterType {
    Seed = 'seed',
    PrivateKey = 'privateKey',
    WavesKeeper = 'wavesKeeper',
    Ledger = 'ledger',
    Tresor = 'tresor',
    Custom = 'custom'
}

export const adapterPriorityList = [
    AdapterType.WavesKeeper,
    AdapterType.Ledger,
    AdapterType.Tresor,
    AdapterType.Seed,
    AdapterType.PrivateKey,
    AdapterType.Custom
];

export const adapterList = [
    SeedAdapter,
    LedgerAdapter,
    WavesKeeperAdapter,
    PrivateKeyAdapter,
    CustomAdapter
];
