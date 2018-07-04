import { find } from './utils';

export * from './adapters/Adapter';
export * from './adapters/SeedAdapter';
export * from './adapters/MetaMaskAdapter';
export * from './adapters/LedgerAdapter';
export * from './adapters/TresorAdapter';
export * from './config';

import { Adapter } from './adapters/Adapter';
import { adapterPriorityList, adapterList, AdapterType } from './config';


export function getAvailableList(): Promise<Array<typeof Adapter>> {
    return Promise.all(
        adapterPriorityList
            .map(async (type) => {
                const adapter = getAdapterByType(type);
                const available = await adapter.isAvailable();

                return available ? adapter : null;
            })
    ).then(list => list.filter(Boolean));
}

export function getAdapterByType(type: AdapterType): any {
    return find({ type }, adapterList);
}
