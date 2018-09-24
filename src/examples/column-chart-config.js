export const columnChartConfig = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Daily Average Glucose'
  },
  xAxis: {
    categories: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ],
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Blood Glucose (mg/dL)'
    }
  },
  series: [{
    name: 'Blood Glucose',
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6]
  }]
};
