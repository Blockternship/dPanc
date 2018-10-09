module.exports = function DailyStatsModel(data) {
  let model = {
    averages: [],
    mins: [],
    maxs: [],
  };

  // Map of stats by day
  var totals = {},
      counts = {},
      min = {},
      max = {};

  // Calculate running stats
  data.forEach(function(datum) {
    let date = datum[0],
        value = parseInt(datum[1]);
    
    let key = date.slice(0, 10);
    
    if (key in totals) {
      totals[key] += value;
      counts[key] += 1;
      
      if (value < min[key]) {
        min[key] = value;
      }
      
      if (value > max[key]) {
        max[key] = value;
      }
    } else {
      totals[key] = value;
      counts[key] = 1;
      min[key] = value;
      max[key] = value;
    }
  });

  // Calculate averages
  Object.keys(totals).forEach(function(key) {
    let year = key.slice(6,10),
        month = key.slice(0, 2),
        day = key.slice(3,5);

    let total = totals[key],
        count = counts[key],
        average = Math.round(total/count);

    model.averages.push(
      [Date.UTC(year, month - 1, day), average],
    );
  });

  // Min
  Object.keys(min).forEach(function(key) {
    let year = key.slice(6,10),
        month = key.slice(0, 2),
        day = key.slice(3,5);
    model.mins.push(
      [Date.UTC(year, month - 1, day), min[key]]
    );
  });

  // Max
  Object.keys(max).forEach(function(key) {
    let year = key.slice(6,10),
        month = key.slice(0, 2),
        day = key.slice(3,5);
    model.maxs.push(
      [Date.UTC(year, month - 1, day), max[key]]
    );
  });

  return model;
};
