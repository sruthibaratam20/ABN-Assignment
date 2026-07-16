const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).send('Hello World - DMP Azure DevOps Assessment');
});

// Simple health check endpoint - useful for App Service / pipeline smoke tests
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Only start listening if this file is run directly (not when required by tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Hello World app listening on port ${port}`);
  });
}

module.exports = app;
