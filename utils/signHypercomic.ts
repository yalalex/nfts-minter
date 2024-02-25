import axios from 'axios';

import { axiosConfig } from './axiosConfig';

export async function signHypercomic(wallet, nftIndex, nonce) {
  try {
    const response = await axios.post(
      'https://play.hypercomic.io/Claim/actionZK/conditionsCheck2',
      {
        trancnt: nonce.toString(),
        walletgbn: 'Metamask',
        wallet: wallet.address.toLowerCase(),
        nftNumber: nftIndex,
      },
      {
        headers: {
          authority: 'play.hypercomic.io',
          method: 'POST',
          path: '/Claim/actionZK/conditionsCheck2',
          scheme: 'https',
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'de-DE,de;q=0.9',
          'Content-Length': '92',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Origin: 'https://zk24.hypercomic.io',
          Referer: 'https://zk24.hypercomic.io/',
        },
        ...axiosConfig(wallet.proxy),
      }
    );
    return response.data.replace(/\n$/, '');
  } catch (error) {
    console.error(
      `Couldn't fetch signature from hypercomic, exiting wallet:`,
      error.message
    );
    return false;
  }
}
