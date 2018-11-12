# JS Library for sign data

## install

```bash
$ npm install --save @waves/signature-adapter
```

## Usage

```typescript

import { SeedAdapter } from '@waves/signature-adapter';

const adapter = new SeedAdapter('some seed phrase with 15 or more chars');
const signable = adapter.makeSignable({
    type: 4, // transaction type number (from SING_TYPES)
    data: ... // data for sign
});

signable.addMyProof().then(signature => {
    console.log(signature); 
});

```

## SeedAdapter

 - getPublicKey:
 
 ```typescript

adapter.getPublicKey() // Promise<string>
```

 -  getAddress:
 ```typescript
adapter.getAddress() // Promise<string>
```

 - getPrivateKey:
 
 ```typescript

adapter.getPrivateKey() // Promise<string>
```

 -  signRequest:
 ```typescript
adapter.signRequest(bytes) // Promise<string>
```

 -  signTransaction:
 ```typescript
adapter.signTransaction(bytes) // Promise<string>
```

 - makeSignable:
 
```typescript
adapter.makeSignable(data) // Signable
```

## Signable

 - getId:
 
 ```typescript
signable.getId() // Promise<string>
```
 
 - sign:
 
 ```typescript
 signable.sign()
 ```
 
 - getMyProofs:
 
 ```typescript
 signable.getMyProofs() // Promise<Signable>
 ```
 
 - hasMySignature:
 
 ```typescript
 signable.hasMySignature(); // Promise<boolean>
 ```
 
 - addMyProof:
 
 ```typescript
 signable.addMyProof() // Promise<string>
 ```
 
  - getDataForApi:
  
  ```typescript
signable.getDataForApi().then(data => {
    return fetch('node-url', {method: 'POST', body: JSON.stringify(data)}); 
});
```
 
