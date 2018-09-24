import React, { Component } from 'react';
import './App.css';
import FormsPage from './Form';
import web3 from './../ethereum/web3';
import { Container, Message } from 'semantic-ui-react';
import ColumnChartContainer from './ColumnChartContainer';

class App extends Component {
  state = {
    response: '',
    address: '',
    error: '',
  };

  componentDidMount() {
    this.setState({
      address: '',
      error: '',
    });

    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));

    this.getAccountAddress();
  }

  callApi = async () => {
    const response = await fetch('/api/helloworld');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  getAccountAddress = async () => {
    if (!web3) {
      console.log('Could not detect MetaMask.');
      this.setState({
        error: 'Could not detect MetaMask. Please make sure MetaMask is enabled!'
      });
    };

    const address = await web3.eth.getAccounts();

    if (address.length === 0) {
      console.log('Could not fetch accounts from MetaMask. Make sure you are logged into MetaMask.');
      this.setState({
        error: 'Could not fetch accounts from MetaMask! Make sure you are logged into MetaMask.',
      });
    } else {
      this.setState({
        address: address[0],
      });
    }
  };

  render() {
    return (
      <Container>
        <Message negative visible={!!this.state.error} hidden={!this.state.error}>
          <Message.Header>{this.state.error}</Message.Header>
        </Message>
        <p className="App-intro">{this.state.response}</p>
        <FormsPage
          address={this.state.address || ''}
          disabled={!!this.state.error}
        />
        <ColumnChartContainer />
      </Container>
    );
  }
}

export default App;
