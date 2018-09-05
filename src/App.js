import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FormsPage from './Form';
import Web3 from 'web3';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {

    const web3 = window.web3
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      const web3js = new Web3(web3.currentProvider);
      console.log(web3js)
    } else {
      console.log('No web3? You should consider trying MetaMask!')
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      const web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    // Now you can start your app & access web3 freely:
    console.log('Cheers!')

    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
    }

  callApi = async () => {
    const response = await fetch('/api/helloworld');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to dPanc</h1>
          <p className="App-desc">
          dPanc is a tool that allows individuals with Type 1 Diabetes
          to be able to gain more insight around their own data.
          </p>
        </header>
          <p className="App-intro">{this.state.response}</p>

          <FormsPage />

      </div>
    );
  }
}

export default App;
