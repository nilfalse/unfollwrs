const mongoose = require('mongoose');

const diff = require('./diff');
const config = require('./.config');


mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.url);

const DiffSchema = new mongoose.Schema({
    '+': [ String ],
    '-': [ String ],
    followers: [ String ],
    calculated_at: { type: Date, default: Date.now, index: -1 }
});

DiffSchema.statics.getLatest = function DiffSchema_latest() {
    return this.find().sort({ _id: -1 }).limit(1).exec().then(function(docs) {
        return docs.length ? docs[0] : new Diff();
    });
};

DiffSchema.methods.hasDataToSave = function DiffSchema_hasDataToSave() {
    return this['+'].length > 0 || this['-'].length > 0;
};

DiffSchema.methods.compareToIds = function DiffSchema_compareToIds(ids) {
    const newDiff = diff(this.followers, ids);
    newDiff.followers = ids;
    return new Diff(newDiff);
};

const Diff = mongoose.model('Diff', DiffSchema);

module.exports = {
    Diff
};
