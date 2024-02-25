import { ethers } from 'ethers';
import { HttpsProxyAgent } from 'https-proxy-agent';

const login = process.env.PROXY_LOGIN;
const password = process.env.PROXY_PASSWORD;

export function createProxyProvider(proxyUrl: string, rpc: string) {
  let provider;
  try {
    const fetchReq = new ethers.FetchRequest(rpc);
    fetchReq.agent = new HttpsProxyAgent(
      `http://${login}:${password}@${proxyUrl}`
    );
    provider =
      proxyUrl !== 'direct'
        ? new ethers.JsonRpcProvider(fetchReq)
        : new ethers.JsonRpcProvider(rpc);
    if (provider) return provider;
    else throw Error();
  } catch (error) {
    console.log('Failed to create proxy provider... Retry in 5 seconds...');
    setTimeout(() => createProxyProvider(proxyUrl, rpc), 5000);
  }
}
