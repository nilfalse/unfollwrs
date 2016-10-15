const http = require('http');

const config = require('./.config');
const models = require('./models');


const server = http.createServer(function(req, res) {
    models.Diff.find().select({
        _id: false,
        '+': true,
        '-': true,
        calculated_at: true
    }).sort({ calculated_at: -1 }).limit(50).exec()
    .then(function(docs) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.end(JSON.stringify(docs));
    }, function(err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'application/javascript'});
        res.end(JSON.stringify({ error: { message: 'something went wrong' } }));
    });
});

server.listen(config.server.port);
