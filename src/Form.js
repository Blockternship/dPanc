import React from 'react';
import { Card, Form } from 'semantic-ui-react';
import { post } from 'axios';

class FormsPage extends React.Component {
  state = {
    value: '',
    file: '',
  };

  // Submit form details and file to express server to process
  // If processing successful, then prompt user's MetaMask to send data to IPFS
  onFormSubmit = async (event) => {
    event.preventDefault();

    const response = await this.uploadFile(this.state.file);

    console.log(response);
  };

  // Function to change file when user uploads a new file
  onChange = (event) => {
    this.setState({
      file: event.target.files[0],
    })
  };

  // Make post call with FormData to express server
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
    return post(url, formData, config)
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
  }
};

export default FormsPage;
