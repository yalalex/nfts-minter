import { zksyncABI } from './data/abi/hypercomic';
import scrollABI from './data/abi/origins.json';
import baseABI from './data/abi/coinEarnings.json';

export const providers = {
  zkSync: 'https://mainnet.era.zksync.io',
  base: 'https://mainnet.base.org',
  scroll: 'https://rpc.scroll.io',
};

export const abis = {
  zksync: zksyncABI,
  scroll: scrollABI,
  base: baseABI,
};

export const links = {
  zksync: 'https://era.zksync.network/',
  scroll: 'https://scrollscan.com/',
  base: 'https://basescan.org/',
};

export const nfts = {
  zkSync: [
    {
      name: 'zkSync Exhibit',
      address: '0xDc5401279A735FF9F3fAb1d73d51d520dC1D8fDF',
      value: '0.00012',
      index: '10',
    },
    {
      name: 'zkSync Charge',
      address: '0x8Cc9502fd26222aB38A25eEe76ae4C7493A3Fa2A',
      value: '0.00012',
      index: '11',
    },
    {
      name: 'zkSync Volume',
      address: '0xeE8020254c67547ceE7FF8dF15DDbc1FFA0c477A',
      value: '0.00012',
      index: '12',
    },
    {
      name: 'zkSync Junior',
      address: '0x761cCCE4a16A670Db9527b1A17eCa4216507946f',
      value: '0.00012',
      index: '9',
    },
    {
      name: 'zkSync Bird',
      address: '0x3F332B469Fbc7A580B00b11Df384bdBebbd65588',
      value: '0.00012',
      index: '13',
    },
  ],
  scroll: [
    {
      name: 'origins',
      address: '0x74670A3998d9d6622E32D0847fF5977c37E0eC91',
      value: '0',
    },
  ],
  base: [
    {
      name: 'coinEarnings',
      address: '0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63',
      value: '0',
    },
  ],
};
