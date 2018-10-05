import React, { Component } from 'react';
import { Card, Form } from 'semantic-ui-react';
import axios from 'axios';
import dPanc from './../ethereum/dPanc';
import web3 from './../ethereum/web3';

class FormsPage extends Component {
  state = {
    file: '',
  };

  /**
  * Function to save file state when user uploads a new file.
  */
  onChange = (event) => {
    this.setState({
      file: event.target.files[0],
    })
  };

  /**
  * Submit form details and file to express server to parse.
  *
  * If processing successful, then upload the parsed data to IPFS.
  */
  onFormSubmit = async (event) => {
    event.preventDefault();

    const response = await this.parseData(this.state.file);
    const { parsedData, date } = response.data;

    // Attempt to get user DB address from dPanc contract
    var dbAddress = await this.getDbAddressFromContract();

    // if dbAddress does not exist, then we will register the user
    if (!dbAddress) {
      const dbName = web3.utils.keccak256(this.props.address);
      console.log(dbName);
      const response = await axios.post("http://localhost:3001/create/", {dbName});
      dbAddress = response.data;

      // Save dbAddress to contract
      await this.saveDbAddressToContract(dbAddress);
    }

    // Upload data to db
    const resp = await axios.post('http://localhost:3001/upload/', {
      dbAddress,
      key: date,
      data: parsedData,
    });

    console.log(resp);

    // TODO: Route user to Dashboard page with 'parsedData' to render graphs
    // this.props.router.push(...)
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

  getDbAddressFromContract = async () => {
    return await dPanc.methods.getDbAddress().call({from: this.props.address});
  };

  saveDbAddressToContract = async (dbAddress) => {
    console.log(`Saving ${dbAddress} to contract...`);

    const response = await dPanc.methods.registerUser(dbAddress).send({from: this.props.address});

    console.log(response);
  };

  render() {
    return(
      <Card>
        <Card.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field required>
              <label>ETH address</label>
              <input value={this.props.address} disabled />
            </Form.Field>
            <Form.Field required>
              <label>Device</label>
              <input value="FreeStyle Libre" disabled />
            </Form.Field>
            <Form.Field required>
              <label>Upload Data</label>
              <input required type="file" onChange={this.onChange} />
            </Form.Field>
            <Form.Button primary disabled={this.props.disabled}>Submit</Form.Button>
          </Form>
        </Card.Content>
      </Card>
    );
  };
};

export default FormsPage;
