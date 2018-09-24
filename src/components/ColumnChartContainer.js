import React from 'react';

import { renderDailyAverageGlucoseColumnChart } from './../utils/renderDailyAverageGlucoseColumnChart';

const COLUMN_CHART_ELEMENT_ID = 'columnChartContainer';

export default class ColumnChartContainer extends React.Component {
  componentDidMount() {
    renderDailyAverageGlucoseColumnChart(COLUMN_CHART_ELEMENT_ID);
  }

  render() {
    return (
      <div
        id={COLUMN_CHART_ELEMENT_ID}
        style={{
          minWidth: '310px',
          height: '400px',
          margin: '0 auto',
        }}
      />
    );
  }
}
