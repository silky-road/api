import { threadId, parentPort } from 'worker_threads';
import { ethers } from 'ethers';
import axios from 'axios';

parentPort?.on('message', async (v) => {
  const itx = new ethers.providers.InfuraProvider(
    'ropsten',
    '48c59754939a47608442b51121894612',
  );

  const signer = new ethers.Wallet(
    '1f16df28c576546ee32320bdbf7c19e68aae51f6f937d15bcdc63df119da6317',
    itx,
  );
  deposit(signer);
  const iface = new ethers.utils.Interface(['function echo(string message)']);
  const data = iface.encodeFunctionData('echo', [v]);

  const tx = {
    to: '0x6663184b3521bF1896Ba6e1E776AB94c317204B6',
    data: data,
    gas: '100000',
    schedule: 'fast',
  };
  const signature = await signRequest(tx, signer);

  const relayTransactionHash = await itx.send('relay_sendTransaction', [
    tx,
    signature,
  ]);

  waitTransaction(relayTransactionHash.relayTransactionHash, itx, v);

  parentPort?.close();
});

async function deposit(signer) {
  const tx = await signer.sendTransaction({
    // ITX deposit contract (same address for all public Ethereum networks)
    to: '0x015C7C7A7D65bbdb117C573007219107BD7486f9',
    // Choose how much ether you want to deposit to your ITX gas tank
    value: ethers.utils.parseUnits('0.0001', 'ether'),
  });
  // Waiting for the transaction to be mined
  await tx.wait();
}
async function signRequest(tx, signer) {
  const relayTransactionHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'bytes', 'uint', 'uint', 'string'],
      [tx.to, tx.data, tx.gas, 3, tx.schedule], // Rinkeby chainId is 4
    ),
  );
  return await signer.signMessage(ethers.utils.arrayify(relayTransactionHash));
}

const wait = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function waitTransaction(relayTransactionHash, itx, contentUrl) {
  let mined = false;
  const instance = axios.create({
    baseURL: 'http://localhost/',
    timeout: 1000,
    headers: { 'content-type': 'application/json' },
  });

  while (!mined) {
    const statusResponse = await itx.send('relay_getTransactionStatus', [
      relayTransactionHash,
    ]);

    if (statusResponse.broadcasts) {
      for (let i = 0; i < statusResponse.broadcasts.length; i++) {
        const bc = statusResponse.broadcasts[i];
        const receipt = await itx.getTransactionReceipt(bc.ethTxHash);
        if (receipt && receipt.confirmations && receipt.confirmations > 1) {
          mined = true;
          const urlArray = contentUrl.split('/');
          const putUrl = urlArray.slice(1).join('/');

          instance.put(
            putUrl,
            JSON.stringify({ publish: true, tx: bc.ethTxHash }),
          );

          return;
        }
      }
    }
    await this.wait(1000);
  }
}
