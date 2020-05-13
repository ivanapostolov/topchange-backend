const express = require('express');
const router = express.Router();
const fs = require('fs');

const buy_sell_one_percent_path = 'data/buy-sell-one-percent.json';
const buy_sell_one_manually_path = 'data/buy-sell-one-manually.json';

var buy_sell_one_percent;
var buy_sell_one_manually;

readPercentList();
readManuallyUpdatedList();

function sendResponseMessage(res, msg) {
    res.send({ message: msg });
}

router.post('/update_percent', function (req, res, next) {
    const { abbreviation, percent } = req.body;
    const abbr = abbreviation.toLowerCase();

    if (buy_sell_one_percent.hasOwnProperty(abbr)) {
        updatePercent(abbr, percent);
        sendResponseMessage(res, "Percent list updated for " + abbreviation.toUpperCase());
    } else {
        sendResponseMessage(res, "Abbreviation " + abbreviation.toUpperCase() + " not found.")
    }
});

router.post('/update_manually', function (req, res, next) {
    const { abbreviation, value } = req.body;
    const abbr = abbreviation.toLowerCase();

    if (buy_sell_one_percent.hasOwnProperty(abbr)) {
        buy_sell_one_manually[abbr] = value.toString();
        setUpdatedManually();
        sendResponseMessage(res, "Manually updated for " + abbreviation.toUpperCase());
    } else {
        sendResponseMessage(res, "Abbreviation " + abbreviation.toUpperCase() + " not found.")
    }
});

router.post('/get_buy_sell_one', function (req, res, next) {
    const { abbreviation, rate } = req.body;
    const abbr = abbreviation.toLowerCase();

    if (buy_sell_one_percent.hasOwnProperty(abbr)) {
        if (buy_sell_one_manually.hasOwnProperty(abbr)) {
            sendResponseMessage(res, buy_sell_one_manually[abbr]);
        } else {
            var rateValue = parseFloat(rate);
            var percent = parseFloat(buy_sell_one_percent[abbr]);
            var responseValue = rateValue - (rateValue * percent) / 100;
            sendResponseMessage(res, responseValue.toString());
        }
    } else {
        sendResponseMessage(res, "Abbreviation " + abbreviation.toUpperCase() + " not found.")
    }
});

function readPercentList() {
    if (fs.existsSync(buy_sell_one_percent_path)) {
        var data = fs.readFileSync(buy_sell_one_percent_path);
        buy_sell_one_percent = JSON.parse(data);
        console.log("<buy-sell-one-percent.json> is LOADED.");
    } else {
        console.log("<buy-sell-one-percent.json> NOT FOUND.");
    }
}

function readManuallyUpdatedList() {
    if (fs.existsSync(buy_sell_one_manually_path)) {
        var data = fs.readFileSync(buy_sell_one_manually_path);
        buy_sell_one_manually = JSON.parse(data);
        console.log("<buy-sell-one-manually.json> is LOADED.");
    } else {
        console.log("<buy-sell-one-manually.json> NOT FOUND.");
    }
}

function updatePercent(abbr, pct) {
    for (var key in buy_sell_one_percent) {
        if (key == abbr) {
            buy_sell_one_percent[key] = pct;
            setUpdatedPercent();
        }
    }
}

function setUpdatedPercent() {
    var updatedPercentList = JSON.stringify(buy_sell_one_percent, null, 2);

    fs.writeFile(buy_sell_one_percent_path, updatedPercentList, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('<buy-sell-one-percent.json> is UPDATED.');
        }
    });
}

function setUpdatedManually() {
    var updatedManuallyList = JSON.stringify(buy_sell_one_manually, null, 2);

    fs.writeFile(buy_sell_one_manually_path, updatedManuallyList, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('<buy-sell-one-manually.json> is UPDATED.');
        }
    });
}

module.exports = router;