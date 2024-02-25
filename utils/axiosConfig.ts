const tunnel = require('tunnel');

const login = process.env.PROXY_LOGIN;
const password = process.env.PROXY_PASSWORD;

export function axiosConfig(proxyUrl: string) {
  if (proxyUrl === 'direct') return {};

  const [host, port] = proxyUrl.split(':');

  const httpsAgent = tunnel.httpsOverHttp({
    proxy: {
      host,
      port,
      proxyAuth: `${login}:${password}`,
    },
    rejectUnauthorized: false,
  });

  const request = {
    httpsAgent,
  };

  return request;
}
