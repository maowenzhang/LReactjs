const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const result = require('dotenv').config();
const dataApi = require('./data/data-api.js');

express()
  .use('/static', express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'dist')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))
  .get('/oauth/callback', function(req, res) {

	  res.render('pages/index');
  })
  .get('/api', function(req, res) {
    let info = dataApi.getTableInfo(function(tableRows) {
      res.send(JSON.stringify(tableRows));
    });
  })
  .get('/api/test/disc', function(req, res) {
    res.redirect('/static/test/disc-test.json');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
