import React, { Component } from 'react';
import './App.css';
import FormsPage from './Form';
import web3 from './../ethereum/web3';
import logo from './logo.png';
import { Container, Message, Menu, Dropdown, Image, Header } from 'semantic-ui-react';
import {
  Route,
  Link,
  Switch,
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Research from './Research';
import Contact from './Contact';
import Nav from './Nav';


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

        <Router>
            <div>
              <Nav />
              <Switch>
                <Route path='/form' render={(props) => <FormsPage {...props} isAuthed={true} address={this.state.address || ''} disabled={!!this.state.error}/>}/>
                <Route path="/dashboard" render={(props) => <Dashboard {...props} isAuthed={true}/>}/>
                <Route exactly component={Research} path="/research" />
                <Route exactly component={Contact} path="/contact" />
              </Switch>
            </div>
        </Router>

        <Container text style={{ marginTop: '7em' }}>
        <Message negative visible={!!this.state.error} hidden={!this.state.error}>
          <Message.Header>{this.state.error}</Message.Header>
        </Message>
        <p className="App-intro">{this.state.response}</p>

        </Container>



      </Container>



    );
  }
}

export default App;
