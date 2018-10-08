var FreeStyleLibreModel = require("../models/FreeStyleLibreModel");
var DailyStatsModel = require('../models/DailyStatsModel');

exports.parseCSV = function(req, res) {
    // Temporary hardcoding to FreeStyle Libre model
    let csvData = req.files[0].buffer.toString();
    let parsedData = new FreeStyleLibreModel(csvData);
    res.send(parsedData);
};

exports.getDailyStats = function(req, res) {
  let data = req.body.data.glucose;
  let dailyAverages = new DailyStatsModel(data);
  res.send(dailyAverages);
}
