const request = require('request');

const config = require('./.config');
const models = require('./models');


function queryTwitterAPI(endpoint, cb, cursor = '-1') {
    request({
            url: 'https://api.twitter.com/1.1/' + endpoint + '.json',
            qs: {
                cursor: cursor,
                stringify_ids: true,
                screen_name: config.twitter.screen_name
            },
            json: true,
            headers: { 'Authorization': 'Bearer ' + config.twitter.token }
        }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                console.error(error);
                console.error(body);
                console.error(response);
                process.exit(1);
            }

            if (body.next_cursor_str === '0') {
                cb(body.ids);
            } else {
                queryFollow(function(ids) {
                    cb(body.ids.concat(ids));
                }, body.next_cursor_str);
            }
        });
}

function queryFollow() {
    return new Promise(function(resolve, reject) {
        queryTwitterAPI('friends/ids', resolve);
    });
}

function queryFollowers() {
    return new Promise(function(resolve, reject) {
        queryTwitterAPI('followers/ids', resolve);
    });
}

queryFollowers().then(function(ids) {
    models.Diff.getLatest().then(function(latest) {
        const diff = latest.compareToIds(ids);
        if (diff.hasDataToSave()) {
            return diff.save();
        }
    }).then(function() {
        process.exit();
    }, function(err) {
        process.exit(1);
    });
});

// Promise.all([queryFollow(), queryFollowers()]).then(function(data) {
//     console.log('I follow:')
//     console.log(data[0].join());
//     console.log('They follow me:')
//     console.log(data[1].join());
//     process.exit();
// });
