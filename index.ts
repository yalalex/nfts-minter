import ethers from 'ethers';
import axios from 'axios';

import { convertTimestamp } from './utils/convertTimestamp';
import { axiosConfig } from './utils/axiosConfig';
import { createProxyProvider } from './utils/createProxyProvider';
import { shuffleArray } from './utils/shuffleArray';
import { signHypercomic } from './utils/signHypercomic';

import { decrypt } from './db/encrypt';
import { connect } from './db/connect';

import { providers, abis, links, nfts } from './config';

export async function mint(network: string) {
  let abi = abis[network];

  async function toMint(wallet, signer, nft, claimContract) {
    switch (network) {
      case 'zksync': {
        const nonce = await signer.getTransactionCount(wallet.address);

        const signature = await signHypercomic(wallet, nft.index, nonce);

        return await claimContract.mint(signature, {
          value: ethers.parseEther(nft.value),
        });
      }

      case 'base': {
        return await claimContract.claim(
          wallet.address,
          0,
          1,
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          0,
          {
            proof: [],
            quantityLimitPerWallet: 2,
            pricePerToken: 0,
            currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          },
          '0x'
        );
      }

      case 'scroll': {
        try {
          const resp = await axios.get(
            `https://nft.scroll.io/p/${wallet.address}.json`,
            axiosConfig(wallet.proxy)
          );

          if (resp.status !== 200) throw Error;

          const { metadata, proof } = resp.data;

          if (!metadata || !proof) {
            console.log('Not eligible, exiting wallet...');
            return false;
          }

          const { deployer, firstDeployedContract, bestDeployedContract } =
            metadata;

          const rarityData = parseInt(metadata.rarityData, 16);

          const data = {
            deployer,
            firstDeployedContract,
            bestDeployedContract,
            rarityData,
          };

          return await claimContract.mint(wallet.address, data, proof);
        } catch (error) {
          console.log('Failed request, exiting wallet...');
          console.log('Error:', error.message);
          return false;
        }
      }
    }
  }

  async function mintAll(wallet, signer) {
    let interval = 0;
    let nftsMinted = [];

    const nftsList = nfts[network];
    const nftsShuffled = shuffleArray(nftsList.slice());

    await Promise.all(
      nftsShuffled.map(async (nft, i) => {
        if (wallet[network].nfts && wallet[network].nfts.includes(nft.name)) {
          console.log(`NFT ${nft.name} already minted. Exiting wallet...`);
          return false;
        }

        const claimContract = new ethers.Contract(nft.address, abi, signer);

        interval =
          i > 0 ? interval + Math.floor(Math.random() * 60000) + 30000 : 0;
        console.log(
          `${nft.name} will be minted from ${wallet.address} in ${(
            interval / 60000
          ).toFixed(0)} minutes at ${convertTimestamp(Date.now() + interval)}`
        );
        await new Promise((resolve) => setTimeout(resolve, interval));

        try {
          const claimTx = await toMint(wallet, signer, nft, claimContract);

          if (!claimTx) throw Error;

          await claimTx.wait();

          nftsMinted.push(nft.name);

          console.log(
            `${convertTimestamp(Date.now())}: Minted successfully ${
              nft.name
            } from ${wallet.address}: ${links[network]}tx/${claimTx.hash}`
          );

          const nftsUpdated = [...wallet[network].nfts, ...nftsMinted];

          const path = `${network}.nfts`;

          await wallets.updateOne(
            { _id: wallet._id },
            {
              $set: { [path]: nftsUpdated },
            }
          );

          console.log(
            `${convertTimestamp(Date.now())}: Database entry for ${
              wallet.address
            } has been updated`
          );
        } catch (error) {
          console.log('Mint transaction failed. Exiting wallet...');
          console.log('Error:', error.message);
          return false;
        }
      })
    );
  }

  const db = await connect();
  const { wallets } = db;

  let interval = 0;

  wallets.forEach(async (wallet, i) => {
    const provider = createProxyProvider(wallet.proxy, providers[network]);
    const key = decrypt(wallet.iv, wallet.key);
    const signer = new ethers.Wallet(key, provider);

    interval =
      i > 0 ? interval + Math.floor(Math.random() * 180000) + 360000 : interval;
    i++;
    console.log(
      `${wallet.address} wallet will be processed in ${(
        interval / 60000
      ).toFixed(0)} minutes at ${convertTimestamp(Date.now() + interval)}`
    );

    await new Promise((resolve) => setTimeout(resolve, interval));
    await mintAll(wallet, signer);
  });
}

const [_, __, network] = process.argv;

mint(network);
