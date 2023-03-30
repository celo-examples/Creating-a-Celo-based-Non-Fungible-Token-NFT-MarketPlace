import React from 'react';
import { createRoot } from 'react-dom/client';
import Web3 from 'web3';
import App from './App';

async function init() {
  let web3;

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    console.log('Non-Ethereum browser detected. You should consider installing MetaMask.');
    return;
  }

  const root = document.getElementById('root');
  createRoot(root).render(<App web3={web3} />);
}

init();
