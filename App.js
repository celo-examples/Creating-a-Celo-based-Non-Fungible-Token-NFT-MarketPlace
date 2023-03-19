import React, { useEffect, useState } from 'react';
import { newKit } from '@celo/contractkit';
import NFTMarketplace from './abis/NFTMarketplace.json';

function App() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    async function init() {
      const kit = newKit(process.env.REACT_APP_NETWORK);
      const accounts = await kit.web3.eth.getAccounts();
      setAccounts(accounts);

      const contract = new kit.web3.eth.Contract(NFTMarketplace.abi, process.env.REACT_APP_CONTRACT_ADDRESS);
      const events = await contract.getPastEvents('NFTForSale', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      const nfts = events.map(event => ({
        nftContract: event.returnValues.nftContract,
        tokenId: event.returnValues.tokenId,
        price: event.returnValues.price,
        seller: event.returnValues.seller
      }));
      setNFTs(nfts);

      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>NFT Marketplace</h1>
      <h2>Account: {accounts[0]}</h2>
      <ul>
        {nfts.map(nft => (
          <li key={`${nft.nftContract}-${nft.tokenId}`}>
            <p>NFT Contract: {nft.nftContract}</p>
            <p>Token ID: {nft.tokenId}</p>
            <p>Price: {nft.price} CELO</p>
            <p>Seller: {nft.seller}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
