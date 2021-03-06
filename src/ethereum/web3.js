import Web3 from 'web3';

export default function getWeb3(provider) {
  if (provider) {
    return new Web3(provider);
  } else if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider);
  }

  console.log('No web3? You should consider trying MetaMask or uPort!');
  return null;
}
