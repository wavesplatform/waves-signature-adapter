import { SIGN_TYPE } from '../src/prepareTx';
import { Money } from '@waves/data-entities';
import { BtcAsset, TORCorp, INSTANTCOIN, WavesAsset, Aracoin, WETH, Voyage, TBTC } from './assets';
import { libs } from '@waves/waves-transactions';
import { BigNumber } from '@waves/bignumber';

const { base58Decode } = libs.crypto;

export const txs = {
    [SIGN_TYPE.ISSUE]: {
        2: {
            name: 'issure',
            data: {
                name: 'JUNKGOLD',
                senderPublicKey: 'E3ao18QtWEzm7hAbKQaoZNBRw6coj2NAy7opqbrqURFr',
                description: 'きらりと光る電子ゴミ。\nSparkling electronic waste.',
                quantity: new BigNumber(5300000000),
                precision: 2,
                reissuable: true,
                script: null,
                fee: Money.fromCoins(100000000, WavesAsset),
                timestamp: 1558497371511,
                version: 2,
            },
            id: 'EJbLEHhB5Sdbmpagug9nBDrBpAfgnTQomhL7xnsvvxS9',
            proof: '3Wgh9tuRdDwQXhAe63iabC5VojkPiJfKPm4tNaawGfpuGncTnT4zMTKzAH3QCjsZQ2c4sqDCyUjDpAAYBGeZLYFb'
        },
        3: {
            name: 'issure',
            data: {
                name: 'JUNKGOLD',
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                description: 'きらりと光る電子ゴミ。\nSparkling electronic waste.',
                quantity: new BigNumber(5300000000),
                precision: 2,
                reissuable: true,
                script: null,
                fee: Money.fromCoins(100000000, WavesAsset),
                timestamp: 1558497371511,
                version: 3,
            },
            id: 'AxRm74gTCA2MdcD3LgWBGd946EFBL69KwMPcYXyin9Mk',
            proof: '3Jp3LqDtBbtJ7uToAgYrqBpiCqYmmdfTVswDEFA95NLZ9bX5A9fusftjSCcMqJKqYtoYMzusEeMHd4n7E1MHiebw'
        },
    },
    [SIGN_TYPE.REISSUE]: {
        2: {
            name: 'reissue',
            data: {
                assetId: 'CUrS6BkWPJVniWE7zh8LyN7PYehMa5WxSKUz3jaGdU2C',
                quantity: new BigNumber('900000000000'),
                reissuable: true,
                senderPublicKey: 'CMxBthD1FH5kB597UY54jP3Q4LJr6LVnTFyajcEEkG46',
                fee: Money.fromTokens(1, WavesAsset),
                timestamp: new Date('2019-05-13T15:45:14.160Z'),
                version: 2,
            },
            id: 'ApcQrPa5yE4PnS9h8aPWEfQpGBPcPP6j5czn6KPRcksc',
            proof: '5Gs7WhnoTALmA2rff6EyA3xM2tH8TFtfKgmEJdMEfFnDUiDnppTCWKgvXrdHRVBeE7g8yq6KJSxa2ZJ6C73BR7zg'
        },
        3: {
            name: 'reissue',
            data: {
                assetId: 'CUrS6BkWPJVniWE7zh8LyN7PYehMa5WxSKUz3jaGdU2C',
                quantity: new BigNumber('900000000000'),
                reissuable: true,
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                fee: Money.fromTokens(1, WavesAsset),
                timestamp: new Date('2019-05-13T15:45:14.160Z'),
                version: 3,
            },
            id: 'HswuFaP3VdUPaTXA4M86kbUDafqPabzjGVefZFuPayBL',
            proof: '3CetGnxnfa5HMpTHbZuCUx6VDisiy6xtWoDZQppjs3TAoBRbTyE8fEaNFQeKqydtCnWfn6P5uuYsWBGPnMDFSLqm'
        }
    },
    [SIGN_TYPE.BURN]: {
        2: {
            name: 'burn',
            data: {
                senderPublicKey: 'BzeniWrmnD1qjoFjVnrYbSXwoiYNpKvaTkhpgwySM31Q',
                assetId: 'GouQ4XCiunWv8A8zJ6BCB9yyWHyFHREiqkuNYiATjJeW',
                amount: new BigNumber(1000000000000000000),
                fee: Money.fromCoins(100000, WavesAsset),
                timestamp: new Date(1558588376106),
                version: 2,
            },
            id: 'EDpiFv8RL9B4o8HvG9uXeocerZ8eiUQ7W1VjGwr9Ld1X',
            proof: '5dZqaWVrEtC4QFdwsrTQmfnL4ivPdLA8Trmz8FvhNYax4V1apQxfMqaxEHmVKhyyTCX73ahzuFMx3AjbypFYpjg4',
        },
        3: {
            name: 'burn',
            data: {
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                assetId: 'GouQ4XCiunWv8A8zJ6BCB9yyWHyFHREiqkuNYiATjJeW',
                amount: new BigNumber(1000000000000000000),
                fee: Money.fromCoins(100000, WavesAsset),
                timestamp: new Date(1558588376106),
                version: 3,
            },
            id: '6QeRyu77f4QBR7kQftb9YbiKrhhen9XtWTWhBKQ1QaN7',
            proof: '4gLkQ9ommfAaKXp1dV3Yr1UgUdx35S9hRFYgmJNgddXpETUbPqniXRYtzm9n1N2PzM7eeUdoorvqitCaz9qT7t6d',
        }
    },
    [SIGN_TYPE.TRANSFER]: {
        2: {
            name: 'transfer',
            data: {
                amount: Money.fromCoins(150200000, BtcAsset),
                attachment: base58Decode('7KeHm8BxCSPdAQe947Lxff'),
                fee: Money.fromCoins(10000, TORCorp),
                recipient: '3PAs2qSeUAfgqSKS8LpZPKGYEjJKcud9Djr',
                sender: '3PQwUzCLuAG24xV7Bd6AMWCz4GEXyDix8Dz',
                senderPublicKey: 'AHLRHBJYtxwqjCcBYnFWeDco8hGJicWYrFd5yM5bWmNh',
                timestamp: new Date(1553167249572),
                version: 2
            },
            id: 'ETVSu3zPHGTh3JEyVGe48jEDgFYhm4KwMeKgvQdAQUyz',
            proof: '5mUv1RbNy3ToQyTMWtRT2WSLLBHoAFaWxXqrk1vjv38ytEPgZG5U694JgyeJKKuxKz8ZvUfFYUhYAZLatPn7Bumo'
        },
        3: {
            name: 'transfer',
            data: {
                amount: Money.fromCoins(150200000, BtcAsset),
                attachment: base58Decode('7KeHm8BxCSPdAQe947Lxff'),
                fee: Money.fromCoins(10000, TORCorp),
                recipient: '3PAs2qSeUAfgqSKS8LpZPKGYEjJKcud9Djr',
                sender: '3PQwUzCLuAG24xV7Bd6AMWCz4GEXyDix8Dz',
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                timestamp: new Date(1553167249572),
                version: 3
            },
            id: 'WZjJQMMSRMcBrXrD4RGcuxfFXF7U7kuAa19hZhhXVhZ',
            proof: '49ay6SEP9yX5csaJhhHNc5DprhvM6NtNrC8YTCys3sjkVKhhzPJFUzvkur9sN4kynaadj4soWD8LK5U2u1t6bMhj'
        },
    },
    [SIGN_TYPE.LEASE]: {
        2: {
            name: 'lease',
            data: {
                recipient: '3P3PfgFKpfisSW6RCsbmgWXtwUH8fHAESw4',
                senderPublicKey: '7QFRujJgBczYVM8Ey5hyAZeqVDNN56Fn1FFxAnjkiUnc',
                amount: Money.fromTokens(3.14220034, WavesAsset),
                fee: Money.fromTokens(0.001, WavesAsset),
                timestamp: new Date('2019-05-23T12:36:04.304Z'),
                version: 2,
            },
            id: '3N6RJ6JCJEvLcVFkojfSTUoJLVuhGVnXbae8DkvMUcft',
            proof: '2WyNnqkU2edRB1qAVgVsxSpm89wMoC9Zg1W52MShXsjtyEnNA5WRHmBXNSxNR8GERU34Bpeh4diqnKJdpt6Jcs3i'
        },
        3: {
            name: 'lease',
            data: {
                recipient: '3P3PfgFKpfisSW6RCsbmgWXtwUH8fHAESw4',
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                amount: Money.fromTokens(3.14220034, WavesAsset),
                fee: Money.fromTokens(0.001, WavesAsset),
                timestamp: new Date('2019-05-23T12:36:04.304Z'),
                version: 3,
            },
            id: 'H75iub6aEjGkTMPfPC4S4KeRJoiUDh9jEMiCSxCH3JTX',
            proof: '5GJBdnbZCp64Mac68mZD1K27H91BsXqhn687hqQoscBP7evWZzS7MaWX66j2CMYKYbKosdYfuUqPzRsRVz7bUHJN'
        },
    },
    [SIGN_TYPE.CANCEL_LEASING]: {
        2: {
            name: 'cancel leasing',
            data: {
                senderPublicKey: '4KZsRyZ9LVNBz6PM4CMLvEVm5oz3JepjUDuFumHx7oGJ',
                leaseId: 'Ag6o9tTqT85AxAwWxzbWR9MEBzxptGjM2h59sGNNPzeT',
                fee: Money.fromTokens(0.001, WavesAsset),
                timestamp: '2019-05-23T12:28:53.064Z',
                version: 2,
            },
            id: '6mJ7g8n7rVXcd1E5MuurZcYEfB5iH5N9wbNbwXz7Rhot',
            proof: 'dPz1HUk8FyxF6pBdPAy9QgTBwuZVrrs8aVnDpcovEpfp7P6ojSQbugnUR47ZviZitF4ASEzcxPyXMhSTg2VB3Vu',
        },
        3: {
            name: 'cancel leasing',
            data: {
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                leaseId: 'Ag6o9tTqT85AxAwWxzbWR9MEBzxptGjM2h59sGNNPzeT',
                fee: Money.fromTokens(0.001, WavesAsset),
                timestamp: '2019-05-23T12:28:53.064Z',
                version: 3,
            },
            id: 'eXwu1xFzFq8fVeSh9EzfbiAdudWQzcGqXgnP2SwGAeG',
            proof: '2ZQcg97xy1NJ1ihHKRAqrCpWnKPkUEW6DQYhxzJFEmjowMTVqs7LFLB1MqFu8j4Xx1VjKq91wY1hkCCivbLFhDbX',
        }
    },
    [SIGN_TYPE.CREATE_ALIAS]: {
        2: {
            name: 'create alias',
            data: {
                timestamp: new Date('2019-05-22T22:06:36.873Z'),
                version: 2,
                senderPublicKey: '5Dw7m2P8BJ9DsFWgKx5YN1ngPcKzrNrswYrqjMnFe1t8',
                alias: 'yes2yunos',
                fee: Money.fromCoins(100000, WavesAsset),
            },
            id: 'FPPLnwckHW7koBLsuThp1rHB8PbZMzpySzndy6ziUga4',
            proof: '78VKQC7nvmMC6rfSDKX7kqoJ8UUAffeF8ScU6GevsMKHL2mgRDPiL2zLGumETZxCurdbDABDCzxNTwAAyTozFCD',
        },
        3: {
            name: 'create alias',
            data: {
                timestamp: new Date('2019-05-22T22:06:36.873Z'),
                version: 3,
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                alias: 'yes2yunos',
                fee: Money.fromCoins(100000, WavesAsset),
            },
            id: '4ga4CQFzw4Bxjy5mSPB39RcfyeMyvHEkt91Noe7fTsLr',
            proof: '4ouk6UyT8zk8wfrPhwa8cN9iupRVvnvzevVfNhRywY2ZizoCuw31GC5kj1u3ZSAFZ39VDwCCidpB6qXzC3pPYR3R',
        }
    },
    [SIGN_TYPE.MASS_TRANSFER]: {
        1: {
            name: 'mass transfer',
            data: {
                totalAmount: Money.fromCoins(1000, INSTANTCOIN),
                transfers: [
                    {
                        amount: Money.fromCoins(500, INSTANTCOIN),
                        name: '3PAMHc8zS6aAG5j6fMQ56cuU9iuFQWfCCf6'
                    },
                    {
                        amount: Money.fromCoins(500, INSTANTCOIN),
                        name: '3P5bt6dBaafovNEZaiqehchHisx2QgU3pv4'
                    }],
                attachment: base58Decode('9phjj2o13msVqLm8PdmcpLzWbRNJi6oKCY4mSuEN5pKKtQtqQc5M6r16txhfyhqFrMG49Kva9LGR1E94zHikcBqEL2La3'),
                fee: Money.fromCoins(200000, WavesAsset),
                sender: '3PQwUzCLuAG24xV7Bd6AMWCz4GEXyDix8Dz',
                senderPublicKey: '6Dugmm8rP7UsEZ1vN3y6s8MY2tfW5aGeJzpkozSR4rk5',
                timestamp: 1558529580270,
                version: 1,
            },
            id: '4stWtcwjq16ZbpwjTP9tJvWFRgsKgHhqnPx6PjskaWEH',
            proof: '45rAeooSYbb4UtxfBfBxnQR6vBdud6KiLG77vMCUX6ibKKT4APeVFPZhbMT35JG8sxLhXc55WRw2iKbxZSuFWBDy'
        },
        2: {
            name: 'mass transfer',
            data: {
                totalAmount: Money.fromCoins(1000, INSTANTCOIN),
                transfers: [
                    {
                        amount: Money.fromCoins(500, INSTANTCOIN),
                        name: '3PAMHc8zS6aAG5j6fMQ56cuU9iuFQWfCCf6'
                    },
                    {
                        amount: Money.fromCoins(500, INSTANTCOIN),
                        name: '3P5bt6dBaafovNEZaiqehchHisx2QgU3pv4'
                    }],
                attachment: base58Decode('9phjj2o13msVqLm8PdmcpLzWbRNJi6oKCY4mSuEN5pKKtQtqQc5M6r16txhfyhqFrMG49Kva9LGR1E94zHikcBqEL2La3'),
                fee: Money.fromCoins(200000, WavesAsset),
                sender: '3PQwUzCLuAG24xV7Bd6AMWCz4GEXyDix8Dz',
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                timestamp: 1558529580270,
                version: 2,
            },
            id: 'AwVbDAKd86Wvg5ZGmF3g7c2cfY6HdMryAx6FykjvRPs3',
            proof: '2dnP6gjzVQpRYT4R2hnAQjcYL71FPZJoTfc74CvHqt25UYRgTFryk9azr1RypWXfnfiyzr6qN18ut8Vwc7GMQHh2'
        }
    },
    [SIGN_TYPE.DATA]: {
        1: {
            name: 'data',
            data: {
                version: 1,
                timestamp: '2019-05-17T16:02:48.062Z',
                senderPublicKey: '4q1NnuNeQAxsEnukCsAmkgaZR9fx8nLuexSBy8TVXgQr',
                fee: Money.fromTokens(0.001, WavesAsset),
                data: [
                    {
                        key: '3P6TxorzdA6yEG4orVU3Z7GbSeh4oq7k1Ko',
                        type: 'integer',
                        value: -3
                    }
                ]
            },
            id: 'HVBSz73gT2wemWBNd6rAUZfmvtP1f41PVwuwEUyfgXwV',
            proof: 'XFcT3ptaMDkMFMCDUUT7r7LuyaXi45AwUnTFauYVUzFVw27AT5oEAbYrzMZyGWnUeiav2BHwXctK7yd3SMhLVNP',
        },
        2: {
            name: 'data',
            data: {
                version: 2,
                timestamp: '2019-05-17T16:02:48.062Z',
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                fee: Money.fromTokens(0.001, WavesAsset),
                data: [
                    {
                        key: '3P6TxorzdA6yEG4orVU3Z7GbSeh4oq7k1Ko',
                        type: 'integer',
                        value: -3
                    }
                ]
            },
            id: '7wr6jYJx5XRxLoMFfQdmmzCVizNmM17ff4sLCDxsSbw7',
            proof: '5PaezdWDmLQzyRoGWMAS5VqoUoAycTGMhGxQEVBEm86E392BNbhZWVYNPS6j8LNamJPjURPAJyZGmkFvNiu3Gjyu',
        }
    },
    [SIGN_TYPE.EXCHANGE]: {
        0: {
            name: 'exchange',
            data: {
                senderPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
                fee: Money.fromCoins(300000, WavesAsset),
                timestamp: 1512075551784,
                version: 1,
                buyOrder: {
                    version: 1,
                    id: 'HFe1UL2xF9q7T1vcxhSk5h6L53sQcM9eevvjtASe1Szs',
                    sender: '3PMajJ6WC4XR3RMr4raWainaKQpfRZLGHsV',
                    senderPublicKey: '3FQtBZWd2PYSRyehzDNEr1YQC29Vd5pCYqiN4nRhnxQK',
                    matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
                    orderType: 'buy',
                    amount: Money.fromCoins(1230364480, WETH),
                    price: Money.fromCoins(8971734818, WavesAsset),
                    timestamp: 1512075437685,
                    expiration: 1512161837685,
                    matcherFee: 300000,
                    signature: '4kh4HmFLCJnJuUfoCFir6G8GSiUcogVpMFEmUjpqutXqhpKFu5ECzxqQ3Kd1TxvtSN5aG35M76nrfvP7bt7UQ1k1',
                    proofs: [
                        '4kh4HmFLCJnJuUfoCFir6G8GSiUcogVpMFEmUjpqutXqhpKFu5ECzxqQ3Kd1TxvtSN5aG35M76nrfvP7bt7UQ1k1'
                    ]
                },
                sellOrder: {
                    version: 1,
                    id: 'EBxTpRwrRPpSgEaH1Lco8B9wZwXYbxUHfggP1tPiSEfW',
                    sender: '3P5XQcyuAs3Fs4FcBXUrKPSQmfY6Zvse36L',
                    senderPublicKey: 'BwgywtnxBGBW53fRqa11K4KLcJkR4BMeu9o3jSB2KCGM',
                    matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
                    assetPair: {
                        amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
                        priceAsset: null
                    },
                    orderType: 'sell',
                    amount: Money.fromCoins(49816000, WETH),
                    price: Money.fromCoins(8971734818, WavesAsset),
                    timestamp: 1512075546319,
                    expiration: 1513803546319,
                    matcherFee: 300000,
                    signature: '2pY4uNy5yHWquYLyBWPCrBiMhNNELAoFTJtWuaXkdb2nMDgDnZUx85ierKAbDtjiE5isv3jTd5udNvm7tfqrDagY',
                    proofs: [
                        '2pY4uNy5yHWquYLyBWPCrBiMhNNELAoFTJtWuaXkdb2nMDgDnZUx85ierKAbDtjiE5isv3jTd5udNvm7tfqrDagY'
                    ]
                },
                amount: 49816000,
                price: 8971734818,
                buyMatcherFee: 12146,
                sellMatcherFee: 300000,
                height: 774422
            },
            id: '2yJZ6Uf6i3RnYdk268WkdJyUR3up9bUxjad1jrTCAiCr',
            proof: '5CNVuHcLak6GjTWvVo3t92y1ZDKeRHdSgedHP5VTg65fC8fAN2RrxDhWNmTP3QktvSQUGi7Z3WjUtVztmHnp7Afk',
        },
        2: {
            name: 'exchange',
            data: {
                'type': 7,
                'senderPublicKey': '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
                'fee': Money.fromCoins(300000, WavesAsset),
                'timestamp': 1559218968473,
                'version': 2,
                'buyOrder': {
                    'version': 1,
                    'id': 'Du7mcUrKveCyBchxfR8RULZK6Ad21AtfWQcR8uqo3WZq',
                    'sender': '3PCdWLg27GMKprpwKcHqcWS2UwXWwQNRwag',
                    'senderPublicKey': '6HfBybJc7E4wJYZgWNpDJf9RnZRDvS4WLbcx7FtYBCbN',
                    'matcherPublicKey': '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
                    'orderType': 'buy',
                    'amount': Money.fromCoins(139538564044, Voyage),
                    'price': Money.fromCoins(105, WavesAsset),
                    'timestamp': 1559218968424,
                    'expiration': 1559219033424,
                    'matcherFee': Money.fromCoins(300000, WavesAsset),
                    'signature': 'SrzSabfBaGFyw1Ex6S7X4BH6mtujgwVxBMKNwcPb2wsyzTrkAzipybjAZcyoBdkEhBoUooUAUPGmHqFcffcTaVG',
                    'proofs': [
                        'SrzSabfBaGFyw1Ex6S7X4BH6mtujgwVxBMKNwcPb2wsyzTrkAzipybjAZcyoBdkEhBoUooUAUPGmHqFcffcTaVG'
                    ]
                },
                'sellOrder': {
                    'version': 1,
                    'id': '8KyKHCgGPYrwco9QNGaNwCbVZgSBvjz8JNW24VxVr5Vb',
                    'sender': '3PCdWLg27GMKprpwKcHqcWS2UwXWwQNRwag',
                    'senderPublicKey': '6HfBybJc7E4wJYZgWNpDJf9RnZRDvS4WLbcx7FtYBCbN',
                    'matcherPublicKey': '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
                    'assetPair': {
                        'amountAsset': '9JKjU6U2Ho71U7VWHvr14RB7iLpx2qYBtyUZqLpv6pVB',
                        'priceAsset': null
                    },
                    'orderType': 'sell',
                    'amount': Money.fromCoins(139538564044000, Voyage),
                    'price': Money.fromCoins(105, WavesAsset),
                    'timestamp': 1559218958940,
                    'expiration': 1559219023940,
                    'matcherFee': Money.fromCoins(300000, WavesAsset),
                    'signature': '3TSrKc3EnZtnULQKDGBW6fMQqqPFZoRzy4fC7n637dHXhHhs9K61mTwAkmXnq8M5sTV4Y7eG7fq1YFUCJVEWVLjC',
                    'proofs': [
                        '3TSrKc3EnZtnULQKDGBW6fMQqqPFZoRzy4fC7n637dHXhHhs9K61mTwAkmXnq8M5sTV4Y7eG7fq1YFUCJVEWVLjC'
                    ]
                },
                'amount': Money.fromCoins(139538095239, Voyage),
                'price': Money.fromCoins(105, WavesAsset),
                'buyMatcherFee': Money.fromCoins(299998, Voyage),
                'sellMatcherFee': Money.fromCoins(299, Voyage),
            },
            id: 'GR7ZDZFU2K7R9zM1qNqJEaC1vgA7hFbD3qFxvsSB9U84',
            proof: '4HdcL9Ppgbf4kKECBvRx28ieSRMtgaFeF97kxSwmB72fLb3FLApkn4KQcKFE4F4pz5UwFcYBP6PB5RqXSrbKLhQM'
        },
    },
    [SIGN_TYPE.SPONSORSHIP]: {
        1: {
            name: 'sponsorship',
            data: {
                timestamp: '2019-05-23T01:51:16.417Z',
                version: 1,
                fee: Money.fromCoins(100000000, WavesAsset),
                senderPublicKey: '2Dmh69GXHWkrM1zT5khG3FeRJmQBACBjPU3sdYz3qC5A',
                minSponsoredAssetFee: Money.fromCoins(100000000000, Aracoin)
            },
            id: '2Lvn7WGJdPgGR7Wdd66qyovUTXGGqcPRfkxU2P4msJQB',
            proof: '43L7KoZy3CUj5XunfbNiEqVbYcaeZrsztUa3qDWGUDFjGSTJDkNqhukFaQmcVFdgFKeh6VU1zCaqeYm9Q1kXfcuV',
        },
        2: {
            name: 'sponsorship',
            data: {
                timestamp: '2019-05-23T01:51:16.417Z',
                version: 2,
                fee: Money.fromCoins(100000000, WavesAsset),
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                minSponsoredAssetFee: Money.fromCoins(100000000000, Aracoin)
            },
            id: 'BtDvL9MaJqowxTeGRDx7zoLtWddAzmkfS7HsmmGDnTJM',
            proof: '3Yj4d2C3cinip4iqsfKmvU5wfu8Dgxfg1jKvxGVVwwCZ7ojyVi3FMHM4CF5Ex7qKNUgakybBkdHqhssPiiMtRc2k',
        },
    },
    [SIGN_TYPE.SET_SCRIPT]: {
        1: {
            name: 'set script',
            data: {
                timestamp: '2019-05-19T16:57:14.262Z',
                version: 1,
                senderPublicKey: 'F2FdoxwSbGAHLcRBBNun7uSBvA9L5RvYWkwHHBc5UHqN',
                script: 'base64:AgQAAAAJaHMxUHVia2V5AQAAACDQVb7HZxGcCjyEGUrIyKkyXvBUTCbTPFHtnRsj8pRfDQQAAAAJaHMyUHVia2V5AQAAACB9+8rXSKq9JZuI77yDN3Gwa1ube2kjCtazzXaevbq1LgQAAAAJaHMxU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAAFAAAACWhzMVB1YmtleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJaHMyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWhzMlB1YmtleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIFAAAACWhzMVNpZ25lZAUAAAAJaHMyU2lnbmVkAAAAAAAAAAACG6WDNQ==',
                fee: Money.fromCoins(1000000, WavesAsset),
            },
            id: '7KP47taMi46pfcEJFPYpneJojH6Li4efWrsEtqsqS3pN',
            proof: '5MUYQnEZMXa3dqdN1c6r8CwJTG3qy9UxTg5g3gTuj2M6dRsPx3Bf23Jxx7sYa1UKtYmGbVYNu5qDPhzSafYSKE33',
        },
        2: {
            name: 'set script',
            data: {
                timestamp: '2019-05-19T16:57:14.262Z',
                version: 2,
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                script: 'base64:AgQAAAAJaHMxUHVia2V5AQAAACDQVb7HZxGcCjyEGUrIyKkyXvBUTCbTPFHtnRsj8pRfDQQAAAAJaHMyUHVia2V5AQAAACB9+8rXSKq9JZuI77yDN3Gwa1ube2kjCtazzXaevbq1LgQAAAAJaHMxU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAAFAAAACWhzMVB1YmtleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJaHMyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWhzMlB1YmtleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIFAAAACWhzMVNpZ25lZAUAAAAJaHMyU2lnbmVkAAAAAAAAAAACG6WDNQ==',
                fee: Money.fromCoins(1000000, WavesAsset),
            },
            id: 'Hm6gVQN1iC4sJgVY3uvvg2KP3sCrjs9srfnvKxeiq6bo',
            proof: '36p56qgdJcHdvEBYWzGTZmtzEGrLaNW86q82BdnM1pdqmpLS53ipX82u6hcBPHNLLSz7FKe5u7H7YgDm2TanZZW4',
        }
    },
    [SIGN_TYPE.SET_ASSET_SCRIPT]: {
        1: {
            name: 'set asset script',
            data: {
                senderPublicKey: '3Zogxgq7Gcw82HVnxBopx7qhWMjJYt55t98XC1hDSMR5',
                fee: Money.fromCoins(100000000, WavesAsset),
                timestamp: 1555958479625,
                version: 1,
                assetId: 'HFW1aho3BGGZd4yFUmANaj38PjCYh2J2xm1WzKy4Td6G',
                script: 'base64:AgQAAAAHV0FWRVNJZAEAAAAEE6vZMwQAAAAGaXNzdWVyCQEAAAAHQWRkcmVzcwAAAAEBAAAACjBzQOgYK1aOY+IEAAAAB2Fzc2V0SWQBAAAACJ+kNIQu6TK4BAAAAAckbWF0Y2gwBQAAAAJ0eAMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAATRXhjaGFuZ2VUcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAMJAAAAAAAAAggICAUAAAABdAAAAAlzZWxsT3JkZXIAAAAJYXNzZXRQYWlyAAAACnByaWNlQXNzZXQFAAAAB1dBVkVTSWQGCQAAAAAAAAIICAgFAAAAAXQAAAAJc2VsbE9yZGVyAAAACWFzc2V0UGFpcgAAAAthbW91bnRBc3NldAUAAAAHV0FWRVNJZAaA4Tys',
            },
            id: 'GxePoQhGWsF7o2r4kvNqqHaGdDyeBYk8K49mqFREQf6W',
            proof: '2eNxhqTGaBjLAwiyovQyfMoMMWddNzw2VHdbYbsY9jde8c8HeQ4rwE8cWTG4vdyacsNSv35vTJsoBrbWjSvARR3C',
        },
        2: {
            name: 'set asset script',
            data: {
                senderPublicKey: 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                fee: Money.fromCoins(100000000, WavesAsset),
                timestamp: 1555958479625,
                version: 2,
                assetId: 'HFW1aho3BGGZd4yFUmANaj38PjCYh2J2xm1WzKy4Td6G',
                script: 'base64:AgQAAAAHV0FWRVNJZAEAAAAEE6vZMwQAAAAGaXNzdWVyCQEAAAAHQWRkcmVzcwAAAAEBAAAACjBzQOgYK1aOY+IEAAAAB2Fzc2V0SWQBAAAACJ+kNIQu6TK4BAAAAAckbWF0Y2gwBQAAAAJ0eAMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAATRXhjaGFuZ2VUcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAMJAAAAAAAAAggICAUAAAABdAAAAAlzZWxsT3JkZXIAAAAJYXNzZXRQYWlyAAAACnByaWNlQXNzZXQFAAAAB1dBVkVTSWQGCQAAAAAAAAIICAgFAAAAAXQAAAAJc2VsbE9yZGVyAAAACWFzc2V0UGFpcgAAAAthbW91bnRBc3NldAUAAAAHV0FWRVNJZAaA4Tys',
            },
            id: 'CwFCATUMBjeid8MHpW7txsaZdsyzei78GBkMNuexURZe',
            proof: 'fNWNDvpGxLeHrnMpYoTgGW1y3DtDJWqxNbioBCTLMjynDKogsB5y94wYZPgphxLXo8ucEmKqPMR7TbVG7reuH6N',
        }
    },
    [SIGN_TYPE.SCRIPT_INVOCATION]: {
        1: {
            network: 'T',
            name: 'script invocation',
            data: {
                'senderPublicKey': 'FkuT6Kxb5UG4pABfhq8y8f2XndyURrPQtq4rASDbMiSK',
                'call': {
                    'function': 'bet',
                    'args': [
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
                'id': 'F3NKXW84ADWjZUdSRHJRNrdGx6eDkGv4R3u1S6xpBPAm',
                'type': 16,
                'version': 1,
                'timestamp': 1559291920421
            },
            id: 'F3NKXW84ADWjZUdSRHJRNrdGx6eDkGv4R3u1S6xpBPAm',
            proof: '251dDXzmZgXHpnwc9Hc9SuzvSydFmPYd4hayTHerMULvj1x9mdD223CUuzA1zCRmyWTBsmmuPGgrqFZjGV767p9R'
        },
        2: {
            network: 'T',
            name: 'script invocation',
            data: {
                'senderPublicKey': 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                'call': {
                    'function': 'bet',
                    'args': [
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
                'id': 'F3NKXW84ADWjZUdSRHJRNrdGx6eDkGv4R3u1S6xpBPAm',
                'type': 16,
                'version': 1,
                'timestamp': 1559291920421
            },
            id: 'AVpE1esAjgfKRrkBT8vENGsZSLztmAsofvHRPvuwK5Yd',
            proof: '2xHrKzUrA35HMcF6Y7kTV6ApyydibnKvD8NxuLCvCQ2LwAdtJx2Et6YaC563RMy2ekuyUpSRkXjJwuhpJBdtF46W'
        }
    },
    
    //////////////NOT TX////////////////
    [SIGN_TYPE.AUTH]: {
        1: {
            name: 'auth request',
            data: {
                host: 'chrome-ext.wvservices.com',
                name: 'test app',
                data: 'test random data',
                senderPublicKey: '2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr'
            },
            id: 'G6VKU9BqJmrp1gjyPf618WTZeMg8PYQBkTCtqx9gbC8g',
            proof: '3ijDFHgMbdBgXkxddV8VMv5ocuKvgWvH4QM65h6E93ixDJiUGVCQnzVcKqBVmV4n6BkVT828C28bCp8hVo38ySxP'
        }
    },
    
    [SIGN_TYPE.COINOMAT_CONFIRMATION]: {
        1: {
            name: 'coinomat confirmation request',
            data: {
                timestamp: 1559227375,
                senderPublicKey: 'AHLRHBJYtxwqjCcBYnFWeDco8hGJicWYrFd5yM5bWmNh'
            },
            id: 'FypP87BPZMygFU4bgrryLCtRCVu28mFGg2V1voKGP1PS',
            proof: '5PzPWJZ5qiFfvkRRn2ois2C9iE5fBB6hogSxkGZB8WBt7urrDRRvNX6xxD6FuNd7S1qHeJdtpUQD8ENBzcQmiVkR'
        }
    },
    
    [SIGN_TYPE.MATCHER_ORDERS]: {
        1: {
            name: 'matcher orders request',
            data: {
                timestamp: 1560812209521,
                senderPublicKey: 'AHLRHBJYtxwqjCcBYnFWeDco8hGJicWYrFd5yM5bWmNh'
            },
            id: '7Ehybg7fHc613Dar7v2KpUP5Vz2fgsDKc5pJwfUhp3Lg',
            proof: '5zWuPQNs8QD7uGWiNLCLjHgFVYwzbyUXTb8bPaQgirfV6AEmdhVUqgmcbSgxJn2YgL3yuQjAZ9TuQrSsb16w9GMc'
        }
    },
    [SIGN_TYPE.WAVES_CONFIRMATION]: {
        1: {
            name: 'waves confirmation request',
            data: {
                timestamp: 1560812209521,
                publicKey: 'AHLRHBJYtxwqjCcBYnFWeDco8hGJicWYrFd5yM5bWmNh',
                senderPublicKey: 'AHLRHBJYtxwqjCcBYnFWeDco8hGJicWYrFd5yM5bWmNh'
            },
            id: '7Ehybg7fHc613Dar7v2KpUP5Vz2fgsDKc5pJwfUhp3Lg',
            proof: '5zWuPQNs8QD7uGWiNLCLjHgFVYwzbyUXTb8bPaQgirfV6AEmdhVUqgmcbSgxJn2YgL3yuQjAZ9TuQrSsb16w9GMc'
        }
    },
    [SIGN_TYPE.CANCEL_ORDER]: {
        0: {
            name: 'cancel order',
            data: {
                id: "GwaYg9pVvFonAXM2afaojQuDJyssJVEJPUjnY1bqhvfs",
                senderPublicKey: "2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr",
            },
            proof: "5UQa5pdm3dysTDc8iPXKcM5DxE2rfyWs759xNUCffLJTeCh3Q89exkonWWWzE2rjVnp3deVq78X5XAvCJGA8F6NJ",
            id: 'EipnRjs8AeYYRKGRPUTy2rxMVaBjt1atJjFDD6vFqtN7'
        },
        1: {
            name: 'cancel order request',
            data: {
                id: '2LRmS354UfyAgSf1Z6gataNmFRYZXjVeGeg8mEgvUt29',
                senderPublicKey: '2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr'
                
            },
            id: '6o4iPH2dTgZzajmtg4vzYuUBV8nocKsh1mB8Nb7YrFNw',
            proof: 'CuvYBVak3JPHsQaAKvijDr1g5WkEpbvP3uoXbQxZXbbAs4Q3BrvqtTsE46bceRmaSUmyXw2DNRWkbwfGZFkMkbv'
        }
    },
    
    [SIGN_TYPE.CREATE_ORDER]: {
        1: {
            data: {
                senderPublicKey: '2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr',
                orderType: 'sell',
                price: Money.fromTokens('0.00030665', BtcAsset),
                amount: Money.fromTokens('0.05186534', WavesAsset),
                matcherFee: Money.fromTokens('0.00300000', WavesAsset),
                matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
                expiration: 1561795622165,
                version: 1,
                timestamp: 1559290022165
            },
            id: 'EYFuGbfHCpqjao4WYdvnqnTfyaJkvdv2cvwa9b7eXX7x',
            proof: '66H7o9oQvtU79Gk7JryH8LmFz94Mv2TBVKyRX3KavJNsysvuLZppRhb5JpEhrRvHu8wsQQPxfSS2XtNQusHr1Z9h'
        },
        2: {
            data: {
                'version': 2,
                'senderPublicKey': 'Cb92PCaMeimQmmK1dSaoUro3j8YhskKhH89JWdmsCkQX',
                'matcherPublicKey': 'E3UwaHCQCySghK3zwNB8EDHoc3b8uhzGPFz3gHmWon4W',
                'orderType': 'buy',
                'amount': Money.fromCoins(71841490, WavesAsset),
                'price': Money.fromCoins(30800, TBTC),
                'timestamp': 1559291009514,
                'expiration': 1561796609514,
                'matcherFee': Money.fromCoins(700000, WavesAsset),
            },
            id: 'FbjthDRAWRxETe9pjgpX3Fi6cBWRzVM5jgitsHaZ7sbj',
            proof: '63N2ogYfxnWA2CYKAKzGrRCR7DDmnqCS1rhfRsseWGFufZvHXkmeiYYBp83CbtKzKAawtzviLYUeYhDuLfw3v3KA'
        },
        3: {
            data: {
                'version': 3,
                'senderPublicKey': 'DgJkVZnf5EDPGzftGDbXZ4SKJQ7s7KRJeh7QmQMhYCPh',
                'matcherPublicKey': 'E3UwaHCQCySghK3zwNB8EDHoc3b8uhzGPFz3gHmWon4W',
                'orderType': 'buy',
                'amount': Money.fromCoins(71841490, WavesAsset),
                'price': Money.fromCoins(30800, TBTC),
                'timestamp': 1559291009514,
                'expiration': 1561796609514,
                'matcherFee': Money.fromCoins(700000, WavesAsset),
            },
            id: 'GakLPAJbLEyWM1LURw9yW4KopPGY5Y8QSLpxSmZXZq1v',
            proof: '3EUueTFDiboDHDvzdKxvM9YPay1FbEJ4UES44pdftkfvmxafMmCVCWbRj1xMzRjhJU4G2toPhPe3yLsaFfQbDYnS'
        }
    },
};
