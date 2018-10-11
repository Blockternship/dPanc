import React, { Component } from 'react';
import HighchartsContainer from './HighchartsContainer';
import ReactHighcharts from 'react-highcharts';
import { Button, Container, Dimmer, Dropdown, Loader, Message, Segment } from 'semantic-ui-react';
import axios from 'axios';
import moment from 'moment';

import getWeb3 from './../ethereum/web3';
import getDPanc from './../ethereum/dPanc';
import uPortInstance from './../ethereum/uport';

import { Connect } from 'uport-connect';

import { getTimeWeightedMean } from './../services/AverageGlucoseService';
import { getA1CFromMgPerDl } from './../services/A1CService';
import { getTimeInZone } from './../services/TimeInZoneService';

const uport = new Connect('dPanc');

const dateOptions = [
  {
    key: 1,
    text: '1 month',
    value: 1
  },
  {
    key: 3,
    text: '3 months',
    value: 3
  },
  {
    key: 6,
    text: '6 months',
    value: 6
  }
];

const getPieChargeConfig = (timeInNormal, timeInLow, timeInHigh) => ({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Time in glucose zones'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Time in zone',
        colorByPoint: true,
        data: [{
            name: 'Normal (80 - 180 mg/dL)',
            y: timeInNormal,
        }, {
            name: 'Low (< 80 mg/dL)',
            y: timeInLow
        }, {
            name: 'High (> 180 mg/dL)',
            y: timeInHigh
        }],
    }]
});

const getSolidGuageConfig = guageValue => ({
    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -150,
            text: 'Hemoglobin A1C Estimate'
        },
        labels: {
            y: 16
        },
        min: 5,
        max: 12,
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    },
    credits: {
        enabled: false
    },

    series: [{
        name: 'Speed',
        data: [guageValue],
    }]
});

const graphConfigsTemplate = {
  chart: {
    type: 'line'
  },
  title: {
    text: ''
  },
  tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°C'
  },
  xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
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
  series: ''
};

class Dashboard extends Component {
  state = {
    address: '',
    loadingText: '',
    error: '',
    lookbackMonths: 1,
    avgGraph: '',
    minGraph: '',
    maxGraph: '',
    provider: '',
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
      const { address, uPortText, uPortDisabled } = state;
        await this.setState({
          address,
          uPortText,
          uPortDisabled,
        });
    }

    if (!this.state.address) {
      await this.getAccountAddress();
    }

    let web3 = getWeb3(this.state.provider);
    if (web3) {
      this.renderGraphs();
    }
  }

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
          address: address[0],
        });
      }
    }
  };

  getGraphConfigs = (title, series, range) => {
    let seriesConfig = [{
            name: 'Blood Glucose',
            type: 'spline',
            data: '',
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: ReactHighcharts.Highcharts.getOptions().colors[0]
            }
        }, {
            name: 'Target Range',
            data: '',
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: ReactHighcharts.Highcharts.getOptions().colors[0],
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
                enabled: false
            }
        }];
    seriesConfig[0].data = series[0].data;
    seriesConfig[1].data = range;

    let graphConfigs = JSON.parse(JSON.stringify(graphConfigsTemplate));
    graphConfigs.title.text = title;
    graphConfigs.series = seriesConfig;
    return graphConfigs;
  };

  getLookbackMonths = (lookbackNum) => {
    var dates = [];

    for (var i = lookbackNum - 1; i >= 0; i--) {
      dates.push(moment().subtract(i, 'months').format('MM-YYYY'));
    }

    return dates;
  };

  renderGraphs = async () => {
    let web3 = getWeb3(this.state.provider);
    var parsedData = null;

    // Get parsed data from
    // (1) props from Form.js page
    if (this.props.location.state) {
      parsedData = this.props.location.state.parsedData;
    }
    // (2) Read from OrbitDB
    else {
      this.setState({
        loadingText: 'Fetching data from OrbitDB...'
      })

      // Attempt to get user DB address from dPanc contract
      if (web3) {
        let dPanc = getDPanc(this.state.provider);
        var dbAddress = await dPanc.methods.getDbAddress(this.state.address).call({from: this.state.address});

        if (dbAddress) {
          let dates = this.getLookbackMonths(this.state.lookbackMonths);

          const resp = await axios.post('http://localhost:3001/getDataByKeys', {
            dbAddress,
            keys: dates,
          });

          if (resp.data.glucose) {
            parsedData = resp.data;
          };
        }
      }
    }

    // Calculate stats
    if (parsedData) {
      this.setState({
        loadingText: 'Running calculations...'
      });
      const statsResp = await axios.post('http://localhost:3001/getDailyStats', {
        data: parsedData
      });

      const data = parsedData.glucose.map(entry => ({
        timestamp: (new Date(entry[0])).getTime(),
        glucose: Number(entry[1]),
      }));

      const longTermAverage = getTimeWeightedMean(data);
      const a1c = getA1CFromMgPerDl(longTermAverage);

      const {
        timeInNormal,
        timeInLow,
        timeInHigh,
      } = getTimeInZone(data);

      let avgSeries = [{ name: 'Blood Glucose', data: statsResp.data.averages }];
      let avgGraphConfigs = this.getGraphConfigs('Daily Average Glucose', avgSeries, statsResp.data.range);

      let minSeries = [{ name: 'Blood Glucose', data: statsResp.data.mins }];
      let minGraphConfigs = this.getGraphConfigs('Daily Minimum Glucose', minSeries, statsResp.data.range);

      let maxSeries = [{ name: 'Blood Glucose', data: statsResp.data.maxs }];
      let maxGraphConfigs = this.getGraphConfigs('Daily Maximum Glucose', maxSeries, statsResp.data.range);

      this.setState({
        loadingText: '',
        avgGraph: <HighchartsContainer config={avgGraphConfigs} />,
        minGraph: <HighchartsContainer config={minGraphConfigs}/>,
        maxGraph: <HighchartsContainer config={maxGraphConfigs}/>,
        a1cGuage: <HighchartsContainer config={getSolidGuageConfig(a1c)}/>,
        timeInZonesPieChart: <HighchartsContainer config={getPieChargeConfig(timeInNormal, timeInLow, timeInHigh)}/>,
      })
    }
    // Else error happened or no data for specified time period
    else {
      this.setState({
        loadingText: '',
        error: 'Failed to fetch data for specified time period!',
      });
    }
  }

  onChangeDateOption = (event, data) => {
    event.preventDefault();

    this.props.location.state = null;

    let web3 = getWeb3(this.state.provider);

    if (web3) {
      if (data.value !== this.state.lookbackMonths) {
        this.setState({
          error: '',
          lookbackMonths: data.value,
        });
        this.renderGraphs();
      }
    }
  };

  authWithuPort = async () => {
    await uport.requestDisclosure({});
    uport.onResponse('disclosureReq').then(res => {
      let address = res.payload.did.split(':')[2];
      this.setState({
        error: '',
        loadingText: '',
        address,
        provider: uport.getProvider(),
        uPortText: `Logged in as ${address} with uPort!`,
        uPortDisabled: true,
      });
    });
  };

  onUploadClick = async () => {
    const { address, uPortText, uPortDisabled } = this.state;

    this.props.history.push({
      pathname: '/form',
      state: {
        address,
        uPortText,
        uPortDisabled,
        disabled: false,
      },
    });
  }

  render() {
      return (
        <Container style={{ marginTop: '7em' }}>
          <Message negative hidden={!this.state.error}>
            <Message.Header>{this.state.error}</Message.Header>
          </Message>
          <Segment basic>
            <Button color='violet' disabled={this.state.uPortDisabled} onClick={this.authWithuPort}>{this.state.uPortText}</Button>
          </Segment>
          <Segment basic>
            <Button primary onClick={this.onUploadClick}>Upload</Button>
          </Segment>
          <Segment basic>
            <Dropdown button selection defaultValue={dateOptions[0].key} options={dateOptions} onChange={this.onChangeDateOption}/>
          </Segment>
          <Dimmer active={!!this.state.loadingText}>
            <Loader>{this.state.loadingText}</Loader>
          </Dimmer>
          <Segment basic>
            {this.state.avgGraph}
          </Segment>
          <Segment basic>
            {this.state.minGraph}
          </Segment>
          <Segment basic>
            {this.state.maxGraph}
          </Segment>
          <Segment basic className="twoColumns">
            {this.state.a1cGuage}
            {this.state.timeInZonesPieChart}
          </Segment>
        </Container>
      );
    }
  }

require("highcharts/js/highcharts-more")(ReactHighcharts.Highcharts);
require("highcharts/js/modules/solid-gauge.js")(ReactHighcharts.Highcharts);

export default Dashboard;
