import getWeb3 from './web3';

const jsonInterface = require("../ethereum/dPanc.json");
const contractAddress = '0xa48f1E44196723bD037bE41d944e732a54B68161';

export default function getDPanc(provider) {
  let web3 = getWeb3(provider);

  if (web3) {
    return new web3.eth.Contract(jsonInterface.abi, contractAddress);
  }
  console.log('Could not load dPanc contract as web3 was not found!');
  return null;
}