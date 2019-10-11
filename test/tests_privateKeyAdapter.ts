import { PrivateKeyAdapter } from '../src/adapters/PrivateKeyAdapter';

describe('PKSeed adapter test', () => {
    
    it('Create adapter from simple seed', async () => {
        const pk = '6xGB7fnzVkER5276nJvJFrUM58LZWCYS2xgxuPFQX8gG';
        const pubk = 'B2Rd3SSLydLDaRjQngaZ8sMH9VAKbLrdyVysG7PDeKRs';
        const address = '3P5GB69tyeW1BEEwdw8w74fusTZdrTXZPQL';
        const adapter = new PrivateKeyAdapter(pk, 'W');
        const gaddress = await adapter.getAddress();
        const privateKey = await adapter.getPrivateKey();
        const publicKey = await adapter.getPublicKey();
        expect(pubk).toBe(publicKey);
        expect(address).toBe(gaddress);
        expect(privateKey).toBe(pk);
    });
});
