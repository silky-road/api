import { Injectable } from '@nestjs/common';
import { Article as ArticleModel } from '@prisma/client';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  async signRequest(tx, signer) {
    const relayTransactionHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'bytes', 'uint', 'uint', 'string'],
        [tx.to, tx.data, tx.gas, 3, tx.schedule], // Rinkeby chainId is 4
      ),
    );
    return await signer.signMessage(
      ethers.utils.arrayify(relayTransactionHash),
    );
  }
  async callContract(code: string) {
    const itx = new ethers.providers.InfuraProvider(
      'ropsten',
      '48c59754939a47608442b51121894612',
    );

    const signer = new ethers.Wallet(
      '1f16df28c576546ee32320bdbf7c19e68aae51f6f937d15bcdc63df119da6317',
      itx,
    );

    this.deposit(signer);
    const iface = new ethers.utils.Interface(['function echo(string message)']);
    const data = iface.encodeFunctionData('echo', [code]);

    console.log(code);

    const tx = {
      to: '0x6663184b3521bF1896Ba6e1E776AB94c317204B6',
      data: data,
      gas: '100000',
      schedule: 'fast',
    };

    const signature = await this.signRequest(tx, signer);

    const relayTransactionHash = await itx.send('relay_sendTransaction', [
      tx,
      signature,
    ]);

    return this.waitTransaction(relayTransactionHash.relayTransactionHash, itx);
  }

  wait = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  async waitTransaction(relayTransactionHash, itx) {
    let mined = false;

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
            return bc.ethTxHash;
          }
        }
      }
      await this.wait(1000);
    }
  }

  async deposit(signer) {
    const tx = await signer.sendTransaction({
      // ITX deposit contract (same address for all public Ethereum networks)
      to: '0x015C7C7A7D65bbdb117C573007219107BD7486f9',
      // Choose how much ether you want to deposit to your ITX gas tank
      value: ethers.utils.parseUnits('0.0001', 'ether'),
    });
    // Waiting for the transaction to be mined
    await tx.wait();
  }
}
