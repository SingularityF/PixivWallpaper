
const express = require('express');
const app = require('./app');
const port = 3000;

app.cloudFunction.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})