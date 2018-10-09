const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser')
const upload = multer();

const app = express();
const port = process.env.PORT || 3001;

var data_controller = require('./controllers/DataController');
var orbitdb_controller = require('./controllers/OrbitDBController');

app.get('/api/helloworld', (req, res) => {
  res.send({ express: 'Hello dPanc!' });
});

// Enable Cross-Origin Resource Sharing
app.use(cors());
// Enable body in post requests
app.use(bodyParser.json({limit: '10mb', extended: true}))

app.listen(port, () => console.log(`Listening on port ${port}`));

app.post('/parse', upload.any(), data_controller.parseCSV);

app.post('/upload', upload.any(), orbitdb_controller.uploadToDb);

app.post('/get', upload.any(), orbitdb_controller.getData);

app.post('/getDataByKeys', upload.any(), orbitdb_controller.getDataByKeys);

app.post('/create', upload.any(), orbitdb_controller.createDb);

app.post('/getDailyStats', upload.any(), data_controller.getDailyStats);
