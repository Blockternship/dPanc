module.exports = function FreeStyleLibreModel(csv_data) {
  let model = {
    glucose: [],
  };

  var historicCount = 0,
      scanCount = 0;

  // Split csv data by new line to build array of rows
  let rows = csv_data.split("\n").slice(2);
  rows.forEach(function(value) {
    let columns = value.split(',');
    let timestamp = columns[2],
        historicGlucose = columns[4],
        scanGlucose = columns[5];

    if (!!historicGlucose) {
      model.glucose.push([
        timestamp,
        historicGlucose,
      ]);
    } else if (!!scanGlucose) {
      model.glucose.push([
        timestamp,
        scanGlucose,
      ]);
    }
  });

  return model;
};
