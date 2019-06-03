import { Asset } from '@waves/data-entities';


export const WavesAsset = new Asset({
    ticker: 'WAVES',
    id: 'WAVES',
    name: 'Waves',
    precision: 8,
    description: '',
    height: 0,
    timestamp: new Date('2016-04-11T21:00:00.000Z'),
    sender: '',
    quantity: 10000000000000000,
    reissuable: false
});

export const BtcAsset = new Asset({
    ticker: 'BTC',
    id: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
    name: 'WBTC',
    precision: 8,
    description: 'Bitcoin Token',
    height: 257457,
    timestamp: new Date(1480690876160),
    sender: '3PC4roN512iugc6xGVTTM2XkoWKEdSiiscd',
    quantity: 2100000000000000,
    reissuable: false
});

export const TORCorp = new Asset({
    ticker: '',
    id: '51LxAtwBXapvvTFSbbh4nLyWFxH6x8ocfNvrXxbTChze',
    name: 'TORCorp',
    precision: 6,
    description: 'TOR Corporation',
    height: 1247969,
    timestamp: new Date(1541398865252),
    sender: '3P287ZEpVU14SAr4jhCF58fZPzfkQv4LXqm',
    quantity: 10000000000000000,
    reissuable: false
});

export const INSTANTCOIN = new Asset({
    ticker: '',
    id: '9LzU7cidQwVXG7inifAoRvh61qdGhT68PyiwGLcboyik',
    sender: '3P5YZYeYu3pEKywhGx2maBzZJ9sw6CuWqpq',
    timestamp: new Date(1516898561323),
    name: 'INSTANTCOIN',
    quantity: 10000000,
    reissuable: true,
    precision: 2,
    description: 'INSTANTCOIN a token that is been build on the Waves platform. Subscribe on the website & social media for more upcoming updates.',
    height: 851542
});

export const Beatz = new Asset({
    ticker: '',
    id: 'GouQ4XCiunWv8A8zJ6BCB9yyWHyFHREiqkuNYiATjJeW',
    sender: '3PEFMbGZ94pn68oAM5xA4xep9Q6FHTwYAfC',
    timestamp: new Date(1558582610441),
    name: 'Beatz',
    quantity: 1000000000000000000,
    reissuable: false,
    precision: 8,
    description: 'Beatz by waves will contribute to the future of Web 3.0 by building a decentralized music platform allowing all users from across the globe to publish their music whether your at home in your shower or a world class music studio you can publish your music and allow users from around the world to purchase it via Beatz by waves .',
    height: 1538724
});

export const Aracoin = new Asset({
    id: '9tv9pBXj8jrJnFiSktMiohULps9LZwhm47bjjCHc8P6s',
    sender: '3PNTrUhPCeuLzLNvJnyNvozpRw5e7XGRYG5',
    timestamp: new Date(1558057919829),
    name: 'Aracoin',
    quantity: 100000000000000,
    reissuable: true,
    precision: 8,
    description: 'moeda Amazonica',
    height: 1529849
});

export const WETH = new Asset({
    'id': '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
    'sender': '3PAfgHQPgodM6MxUzqRkepiKofGnECNoxt5',
    'timestamp': new Date(1500374348683),
    'name': 'WETH',
    'quantity': 10000000000000000,
    'reissuable': true,
    'precision': 8,
    'description': 'Ethereum Token',
    'height': 585888
});

export const Voyage = new Asset({
    'id': '9JKjU6U2Ho71U7VWHvr14RB7iLpx2qYBtyUZqLpv6pVB',
    'sender': '3PCdWLg27GMKprpwKcHqcWS2UwXWwQNRwag',
    'timestamp': new Date(1555369015615),
    'name': 'Voyage',
    'quantity': 100000000000000000,
    'reissuable': false,
    'precision': 8,
    'description': 'Voyage Token',
    'height': 1484354
});

export const TBTC = new Asset({
    'id': '9SxLVHaEGTeEjRiAMnEw74YWWndQDRw8SZhknK9EYoUd',
    'sender': '3P9Typ8Wnoxt719juABnCeErU5wAvfcXAU9',
    'timestamp': new Date(1553718649292),
    'name': 'TBTC',
    'quantity': 100000000,
    'reissuable': true,
    'precision': 8,
    'description': 'Tokenomica BTC',
    'height': 1456494
});
