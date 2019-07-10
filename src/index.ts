import { find } from './utils';

export * from './adapters';
export * from './prepareTx';
export { isValidAddress } from './prepareTx/fieldValidator';
export * from './config';
export * from './Signable';
export * from './constants';
export * from './utils';

import { Adapter } from './adapters';
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
