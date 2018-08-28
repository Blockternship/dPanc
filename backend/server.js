const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/helloworld', (req, res) => {
  res.send({ express: 'Hello dPanc!' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));