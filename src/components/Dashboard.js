import React, { Component } from 'react';
import HighchartsContainer from './HighchartsContainer';
import ReactHighcharts from 'react-highcharts';
import { columnChartConfig } from './../examples/column-chart-config';
import { solidGuageConfig } from './../examples/solid-guage-config';
import { Container, Message, Menu, Dropdown, Image, Header, Segment } from 'semantic-ui-react';

class Dashboard extends Component {


render() {
  // console.log(this.props);
  // console.log('dashboard');
    return (
  <Container style={{ marginTop: '7em' }}>
  <Segment basic>
  <HighchartsContainer config={columnChartConfig} />
  <HighchartsContainer config={solidGuageConfig} />
  </Segment>
  </Container>
    )
  }
}

require("highcharts/js/highcharts-more")(ReactHighcharts.Highcharts);
require("highcharts/js/modules/solid-gauge.js")(ReactHighcharts.Highcharts);

export default Dashboard;
