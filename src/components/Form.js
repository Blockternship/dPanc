import React, { Component } from 'react';
import { Button, Card, Container, Dimmer, Form, Loader, Message, Segment } from 'semantic-ui-react';
import axios from 'axios';

import getWeb3 from './../ethereum/web3';
import getDPanc from './../ethereum/dPanc';
import uPortInstance from './../ethereum/uport';

import { Connect } from 'uport-connect';
const uport = new Connect('dPanc');

class FormsPage extends Component {

  state = {
    disabled: true,
    address: '',
    file: '',
    loadingText: '',
    error: '',
    provider: null,
    uPortText: 'Login with uPort',
    uPortDisabled: false,
  };

  async componentDidMount() {
    let provider = uPortInstance.getProvider();
    if (provider) {
      this.setState({
        provider,
      });
    }

    let state = this.props.location.state;
    if (state) {
      const { address, uPortText, uPortDisabled, disabled } = state;
        await this.setState({
          address,
          uPortText,
          uPortDisabled,
          disabled,
        });
    }

    if (!this.state.address) {
      this.getAccountAddress();
    }
  }

  /**
  * Function to save file state when user uploads a new file.
  */
  onChange = (event) => {
    this.setState({
      file: event.target.files[0],
    })
  };

  getAccountAddress = async () => {
    let web3 = getWeb3(this.state.provider);

    if (!web3) {
      console.log('Could not detect MetaMask.');
      this.setState({
        error: 'Could not detect MetaMask. Please make sure MetaMask is enabled!'
      });
    } else {
      const address = await web3.eth.getAccounts();

      if (address.length === 0) {
        console.log('Could not fetch accounts from MetaMask. Make sure you are logged into MetaMask.');
        this.setState({
          error: 'Could not fetch accounts from MetaMask! Make sure you are logged into MetaMask.',
        });
      } else {
        this.setState({
          disabled: false,
          address: address[0],
        });
      }
    }
  };

  /**
  * Submit form details and file to express server to parse.
  *
  * If processing successful, then upload the parsed data to IPFS.
  */
  onFormSubmit = async (event) => {
    event.preventDefault();

    // Set dimmer & loading icon
    this.setState({
      loadingText: 'Parsing data...',
    })

    const response = await this.parseData(this.state.file);
    const { parsedData, date } = response.data;

    // Attempt to get user DB address from dPanc contract
    let dPanc = getDPanc(this.state.provider);
    var dbAddress = await dPanc.methods.getDbAddress(this.state.address).call({ from: this.state.address });

    // if dbAddress does not exist, then we will register the user
    if (!dbAddress) {
      this.setState({ loadingText: 'Creating a database and registering user to dPanc contract...' })

      let web3 = getWeb3(this.state.provider);
      const dbName = web3.utils.keccak256(this.state.address);
      console.log(dbName);
      const response = await axios.post("http://localhost:3001/create/", { dbName });
      dbAddress = response.data;

      // Save dbAddress to contract
      await this.saveDbAddressToContract(dbAddress);
    }

    // Upload data to db
    this.setState({ loadingText: 'Uploading data to database...' })
    await axios.post('http://localhost:3001/upload/', {
      dbAddress,
      key: date,
      data: parsedData,
    });

    this.setState({
      loadingText: 'Done! Redirecting to Dashboard...',
    });

    setTimeout(() => {
      this.setState({
        loadingText: '',
      });

      const { address, uPortText, uPortDisabled } = this.state;

      this.props.history.push({
        pathname: '/dashboard',
        state: {
          parsedData,
          address,
          uPortText,
          uPortDisabled,
        }
      });
    }, 1000);
  };

  /**
  * Post FormData to express server
  */
  parseData = (file) => {
    const url = 'http://localhost:3001/parse/';
    const formData = new FormData();
    formData.append('file', file);
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }
    return axios.post(url, formData, config)
  };

  saveDbAddressToContract = async (dbAddress) => {
    console.log(`Saving ${dbAddress} to contract...`);
    let dPanc = getDPanc(this.state.provider);
    const response = await dPanc.methods.registerUser(this.state.address, dbAddress).send({from: this.state.address});
    console.log(response);
  }

  authWithuPort = async () => {
    await uport.requestDisclosure({});
    uport.onResponse('disclosureReq').then(res => {
      let address = res.payload.did.split(':')[2];
      this.setState({
        error: '',
        loadingText: '',
        address,
        uPortText: `Logged in as ${address} with uPort!`,
        uPortDisabled: true,
        provider: uport.getProvider(),
      });
      uPortInstance.saveInstance(uport);
    });
  };

  render() {
    return(
      <Container style={{ marginTop: '7em' }}>
        <Message negative hidden={!this.state.error}>
          <Message.Header>{this.state.error}</Message.Header>
        </Message>
        <Segment basic>
          <Button color='violet' disabled={this.state.uPortDisabled} onClick={this.authWithuPort}>{this.state.uPortText}</Button>
        </Segment>
        <Segment basic>
          <Card centered>
          <Dimmer active={!!this.state.loadingText}>
            <Loader>{this.state.loadingText}</Loader>
          </Dimmer>
            <Card.Content>
              <Form onSubmit={this.onFormSubmit}>
                <Form.Field required>
                  <label>ETH address</label>
                  <input value={this.state.address} disabled />
                </Form.Field>
                <Form.Field required>
                  <label>Device</label>
                  <input value="FreeStyle Libre" disabled />
                </Form.Field>
                <Form.Field required>
                  <label>Upload Data</label>
                  <input required type="file" onChange={this.onChange} />
                </Form.Field>
                <Form.Button primary disabled={this.state.disabled}>Submit</Form.Button>
              </Form>
            </Card.Content>
          </Card>
        </Segment>
        <Segment basic>
          {this.state.avgGraph}
          {this.state.minGraph}
          {this.state.maxGraph}
        </Segment>
      </Container>
    );
  };
};

export default FormsPage;
