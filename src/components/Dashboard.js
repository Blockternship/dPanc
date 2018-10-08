import React, { Component } from 'react';
import HighchartsContainer from './HighchartsContainer';
import ReactHighcharts from 'react-highcharts';
import { Container } from 'semantic-ui-react';
import axios from 'axios';

const graphConfigTemplate = {
  chart: {
    type: 'column'
  },
  title: {
    text: ''
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
  series: ''
};

class Dashboard extends Component {

  state = {
    avgGraph: '',
    minGraph: '',
    maxGraph: '',
  };

  componentDidMount() {
    this.renderGraphs();
  }

  renderGraphs = async () => {
    if (this.props.location.state) {
      const statsResp = await axios.post('http://localhost:3001/getDailyStats', {
        data: this.props.location.state.parsedData
      });

      let avgSeries = [{ name: 'Blood Glucose', data: statsResp.data.averages }];
      let avgGraphConfigs = JSON.parse(JSON.stringify(graphConfigTemplate))
      avgGraphConfigs.title.text = 'Daily Average Glucose';
      avgGraphConfigs.series = avgSeries;

      let minSeries = [{ name: 'Blood Glucose', data: statsResp.data.mins }];
      let minGraphConfigs = JSON.parse(JSON.stringify(graphConfigTemplate))
      minGraphConfigs.title.text = 'Daily Minimum Glucose';
      minGraphConfigs.series = minSeries;

      let maxSeries = [{ name: 'Blood Glucose', data: statsResp.data.maxs }];
      let maxGraphConfigs = JSON.parse(JSON.stringify(graphConfigTemplate))
      maxGraphConfigs.title.text = 'Daily Maximum Glucose';
      maxGraphConfigs.series = maxSeries;

      this.setState({
        avgGraph: <HighchartsContainer config={avgGraphConfigs} />,
        minGraph: <HighchartsContainer config={minGraphConfigs}/>,
        maxGraph: <HighchartsContainer config={maxGraphConfigs}/>
      })
    }
  }

  render() {
      return (
        <Container>
          {this.state.avgGraph}
          {this.state.minGraph}
          {this.state.maxGraph}
        </Container>
        )
    }
}

require("highcharts/js/highcharts-more")(ReactHighcharts.Highcharts);
require("highcharts/js/modules/solid-gauge.js")(ReactHighcharts.Highcharts);

export default Dashboard;
