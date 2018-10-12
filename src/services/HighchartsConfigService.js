export const getTimeInZonePieChartConfig = (timeInNormal, timeInLow, timeInHigh) => ({
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

export const getHA1CGuageConfig = guageValue => ({
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

export const getDailyGlucoseLineChartConfig = (title, series) => ({
  chart: {
    type: 'line'
  },
  title: {
    text: title
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
  series,
});
