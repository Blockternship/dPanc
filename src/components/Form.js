import React, { Component } from 'react';
import { Card, Container, Dimmer, Form, Loader, Message, Segment } from 'semantic-ui-react';
import axios from 'axios';
import dPanc from './../ethereum/dPanc';
import web3 from './../ethereum/web3';

class FormsPage extends Component {

  state = {
    disabled: true,
    address: '',
    file: '',
    loadingText: '',
  };

  componentDidMount() {
    this.getAccountAddress();
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
    var dbAddress = await dPanc.methods.getDbAddress().call({from: this.state.address});

    // if dbAddress does not exist, then we will register the user
    if (!dbAddress) {
      this.setState({ loadingText: 'Creating a database and registering user to dPanc contract...' })

      const dbName = web3.utils.keccak256(this.state.address);
      console.log(dbName);
      const response = await axios.post("http://localhost:3001/create/", {dbName});
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

      this.props.history.push({
        pathname: '/dashboard',
        state: { parsedData }
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

    const response = await dPanc.methods.registerUser(dbAddress).send({from: this.state.address});

    console.log(response);
  };

  render() {
    return(
      <Container style={{ marginTop: '7em' }}>
        <Message negative hidden={!this.state.error}>
          <Message.Header>{this.state.error}</Message.Header>
        </Message>
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
