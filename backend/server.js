const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const app = express();
const port = process.env.PORT || 3001;

var data_controller = require('./controllers/DataController');

app.get('/api/helloworld', (req, res) => {
  res.send({ express: 'Hello dPanc!' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// Enable Cross-Origin Resource Sharing
app.use(cors());

app.post('/upload', upload.any(), data_controller.parseCSV);
