import React, { Component } from 'react';
import { Card, Container, Dimmer, Form, Loader, Segment } from 'semantic-ui-react';
import axios from 'axios';
import dPanc from './../ethereum/dPanc';
import web3 from './../ethereum/web3';
import HighchartsContainer from './HighchartsContainer';

class FormsPage extends Component {

  state = {
    file: '',
    loadingText: '',
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

    // Set dimmer & loading icon
    this.setState({
      loadingText: 'Parsing data...',
    })

    const response = await this.parseData(this.state.file);
    const { parsedData, date } = response.data;

    // Attempt to get user DB address from dPanc contract
    var dbAddress = await this.getDbAddressFromContract();

    // if dbAddress does not exist, then we will register the user
    if (!dbAddress) {
      this.setState({ loadingText: 'Creating a database and registering user to dPanc contract...' })

      const dbName = web3.utils.keccak256(this.props.address);
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
      this.renderGraphs(parsedData);
    }, 1000);

    // TODO: Route user to Dashboard page with 'parsedData' to render graphs
    // this.props.router.push(...)
  };

  // TODO: Move to dashboard page
  renderGraphs = async (parsedData) => {
    this.setState({
      loadingText: '',
    });

    const statsResp = await axios.post('http://localhost:3001/getDailyStats', {
      data: parsedData
    });

    let avgSeries = [{ name: 'Blood Glucose', data: statsResp.data.averages }];
    let minSeries = [{ name: 'Blood Glucose', data: statsResp.data.mins }];
    let maxSeries = [{ name: 'Blood Glucose', data: statsResp.data.maxs }];

    let avgGraphConfigs = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Daily Average Glucose'
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
              month: '%e. %b',
          },
          title: {
              text: 'Date'
          }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Blood Glucose (mg/dL)'
        }
      },
      series: avgSeries
    };

    let minGraphConfigs = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Daily Min Glucose'
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
              month: '%e. %b',
          },
          title: {
              text: 'Date'
          }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Blood Glucose (mg/dL)'
        }
      },
      series: minSeries
    };

    let maxGraphConfigs = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Daily Max Glucose'
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
              month: '%e. %b',
          },
          title: {
              text: 'Date'
          }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Blood Glucose (mg/dL)'
        }
      },
      series: maxSeries
    };

    this.setState({
      avgGraph: <HighchartsContainer config={avgGraphConfigs} />,
      minGraph: <HighchartsContainer config={minGraphConfigs}/>,
      maxGraph: <HighchartsContainer config={maxGraphConfigs}/>
    })
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
      <Container>
        <Segment basic>
          <Dimmer active={!!this.state.loadingText}>
            <Loader>{this.state.loadingText}</Loader>
          </Dimmer>
          <Card centered>
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
