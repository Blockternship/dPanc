import React, { Component } from 'react';
import HighchartsContainer from './HighchartsContainer';
import ReactHighcharts from 'react-highcharts';
import { columnChartConfig } from './../examples/column-chart-config';
import { solidGuageConfig } from './../examples/solid-guage-config';
import { Container, Message, Menu, Dropdown, Image, Header } from 'semantic-ui-react';

class Dashboard extends Component {

render() {
    return (
  <Container>
  <HighchartsContainer config={columnChartConfig} />
  <HighchartsContainer config={solidGuageConfig} />
  </Container>
    )
  }
}

require("highcharts/js/highcharts-more")(ReactHighcharts.Highcharts);
require("highcharts/js/modules/solid-gauge.js")(ReactHighcharts.Highcharts);

export default Dashboard;
