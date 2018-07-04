import { SeedAdapter } from './adapters/SeedAdapter';

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
    SeedAdapter
];
