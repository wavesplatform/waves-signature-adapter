import { SeedAdapter } from './adapters/SeedAdapter';
import { LedgerAdapter } from './adapters/LedgerAdapter';
import { WavesKeeperAdapter } from './adapters';

export const enum AdapterType {
    Seed = 'seed',
    WavesKeeper = 'wavesKeeper',
    Ledger = 'ledger',
    Tresor = 'tresor'
}

export const adapterPriorityList = [
    AdapterType.WavesKeeper,
    AdapterType.Ledger,
    AdapterType.Tresor,
    AdapterType.Seed
];

export const adapterList = [
    SeedAdapter,
    LedgerAdapter,
    WavesKeeperAdapter
];
