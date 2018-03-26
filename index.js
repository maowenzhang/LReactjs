const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const result = require('dotenv').config();
const dataApi = require('./data/data-api.js');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/oauth/callback', function(req, res) {

	  res.render('pages/index');
  })
  .get('/api', function(req, res) {
    let info = dataApi.getTableInfo(function(tableRows) {
      res.send(JSON.stringify(tableRows));
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
