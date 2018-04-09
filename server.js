const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const result = require('dotenv').config();
const dataApi = require('./data/data-api.js');

const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render("login"));
app.post('/login', function(req, res) {
  res.send("log in submitted");
});
app.get('/oauth/callback', function(req, res) {

	  res.render('pages/index');
  });
app.get('/api', function(req, res) {
    let info = dataApi.getTableInfo(function(tableRows) {
      res.send(JSON.stringify(tableRows));
    });
  });
app.get('/api/test/disc', function(req, res) {
    res.redirect('/static/test/disc-test.json');
  });
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
