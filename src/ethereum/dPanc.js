import getWeb3 from './web3';

var jsonInterface = require("../ethereum/dPanc.json");
var dPanc;
let web3 = getWeb3();
if (web3) {
  dPanc = new web3.eth.Contract(jsonInterface.abi,  
    '0xfa29857ea29515187f3e0c590cdcd8cd0d0bcf02'
  );
}

export default dPanc;
