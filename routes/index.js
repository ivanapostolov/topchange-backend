var express = require('express');
var router = express.Router();
const fs = require('fs');

const buy_sell_one_manually_path = 'data/buy-sell-one-manually.json';

function sendResponseMessage(res, msg) {
  res.send({ message: msg });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/update', function(req, res, next) {
  setUpdatedManually();
  sendResponseMessage(res, "Server is UPDATED.")
});

function setUpdatedManually() {
  fs.writeFile(buy_sell_one_manually_path, "{ }", (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log('<buy-sell-one-manually.json> is EMPTY.');
      }
  });
}

module.exports = router;
