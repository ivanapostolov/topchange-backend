const express = require('express');
const router = express.Router();
const fs = require('fs');

const user_list_path = 'data/user-list.json';

var user_list;

readUsersList();

function sendResponseMessage(res, msg) {
    res.send({ message: msg });
}

router.post('/set_user', function (req, res, next) {
    const { username, password } = req.body;

    if(username && password && user_list) {
        setNewUser(username, password);
        sendResponseMessage(res, "New user has been saved successfully");
    } else {
        console.log("PROBLEM at /set_user endpoint");
    }
});

function readUsersList() {
    if(fs.existsSync(user_list_path)) {
        var data = fs.readFileSync(user_list_path);
        user_list = JSON.parse(data);
        console.log("<user-list.json> is LOADED.");
    } else {
        console.log("<user-list.json> NOT FOUND.");
    }
}

function setNewUser(username, password) {
    user_list[username] = password;
    var updatedUserList = JSON.stringify(user_list, null, 2);

    fs.writeFile(user_list_path, updatedUserList, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('New user has been saved.');
        }
    });
}

module.exports = router;
