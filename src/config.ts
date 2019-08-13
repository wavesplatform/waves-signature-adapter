import { SeedAdapter } from './adapters/SeedAdapter';
import { LedgerAdapter } from './adapters/LedgerAdapter';
import { BancoinKeeperAdapter } from './adapters';
import {PrivateKeyAdapter} from "./adapters/PrivateKeyAdapter";

export const enum AdapterType {
    Seed = 'seed',
    PrivateKey = 'privateKey',
    BancoinKeeper = 'BancoinKeeper',
    Ledger = 'ledger',
    Tresor = 'tresor'
}

export const adapterPriorityList = [
    AdapterType.BancoinKeeper,
    AdapterType.Ledger,
    AdapterType.Tresor,
    AdapterType.Seed,
    AdapterType.PrivateKey
];

export const adapterList = [
    SeedAdapter,
    LedgerAdapter,
    BancoinKeeperAdapter,
    PrivateKeyAdapter
];
