import React, { Component } from 'react';
import { Card, Form } from 'semantic-ui-react';
import axios from 'axios';

class FormsPage extends Component {
  state = {
    file: '',
  };

  /**
  * Submit form details and file to express server to parse.
  *
  * If processing successful, then upload the parsed data to IPFS.
  */
  onFormSubmit = async (event) => {
    event.preventDefault();

    const response = await this.uploadFile(this.state.file);

    // Upload parsed data to IPFS
    this.uploadToIpfs(response.data);
  };

  /**
  * Upload parsed data to IPFS via infura.
  */
  uploadToIpfs = async (parsedData) => {
    var formData = new FormData();
    formData.append("file", JSON.stringify(parsedData));

    const url = 'https://ipfs.infura.io:5001/api/v0/add';
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }

    try {
      const response = await axios.post(url, formData, config);
      const ipfsHash = response.data.Hash;

      this.uploadIPFSHash(ipfsHash);
    } catch (e) {
      console.log(e);
    }
  };

  /**
  * Upload IPFS hash of parsed data to dPanc contract on Ethereum network.
  */
  uploadIPFSHash = async (ipfsHash) => {
    console.log(`Uploading ${ipfsHash} to dPanc contract...`);
    // TODO: Finish and deploy contract, and upload IPFS hash to contract here
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
  * Post FormData to express server
  */
  uploadFile = (file) => {
    const url = 'http://localhost:3001/upload/';
    const formData = new FormData();
    formData.append('file', file);
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
        }
    }
    return axios.post(url, formData, config)
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
