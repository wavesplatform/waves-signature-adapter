import { SeedAdapter } from './adapters/SeedAdapter';
import { LedgerAdapter } from './adapters/LedgerAdapter';

export const enum AdapterType {
    Seed = 'seed',
    MetaMask = 'metaMask',
    Ledger = 'ledger',
    Tresor = 'tresor'
}

export const adapterPriorityList = [
    AdapterType.MetaMask,
    AdapterType.Ledger,
    AdapterType.Tresor,
    AdapterType.Seed
];

export const adapterList = [
    SeedAdapter,
    LedgerAdapter
];
