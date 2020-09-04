import { SeedAdapter } from '../src/adapters';
import { Money } from '@waves/data-entities';
import { WavesAsset } from './assets';

const testSeed = 'some test seed words without money on mainnet';

describe('Test invoke', () => {

    const tx = {
        network: 'T',
        name: 'script invocation',
        data: {
            'senderPublicKey': 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
            'call': {
                'function': 'bet',
                'args': [
                    { 'type': 'list', value: [{ type: 'string', value: "data" }] },
                    {
                        'type': 'string',
                        'value': '6cPwB9AzRg3D3uTSVSfn1Pvhb5Y5Amxpv7akaCUWRbrv2REP1'
                    },
                    {
                        'type': 'string',
                        'value': '36'
                    }
                ]
            },
            'dApp': '3MqQ9ihYKGehfUnXYf5WmkYSZUD71ByeCQe',
            'feeAssetId': null,
            'fee': Money.fromCoins(500000, WavesAsset),
            'payment': [Money.fromCoins('1400500000', WavesAsset)
            ],
            'type': 16,
            'version': 1,
            'timestamp': 1559291920421
        },
    };
    it('Args List', () => {
        const adapter = new SeedAdapter(testSeed, tx.network);
        const signable = adapter.makeSignable({
            type: tx.data.type,
            data: { ...tx.data } as any
        } as any);

        return signable.getSignature().then(signature => {
            expect(typeof signature).toEqual('string');
        });
    });
});

