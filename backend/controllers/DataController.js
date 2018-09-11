var FreeStyleLibreModel = require("../models/FreeStyleLibreModel");

exports.parseCSV = function(req, res) {
    // Temporary hardcoding to FreeStyle Libre model
    let csvData = req.files[0].buffer.toString();
    let parsedData = new FreeStyleLibreModel(csvData);
    res.send(parsedData);
};
