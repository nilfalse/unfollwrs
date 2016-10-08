module.exports = function diff(a, b) {
    const totalArr = a.concat(b);
    const mapOfIds = {};
    const borderId = a.length;

    const added = [];
    const removed = [];

    totalArr.forEach(function(userId, arrIdx) {
        var factor = arrIdx < borderId ? -1 : 1;
        if (mapOfIds.hasOwnProperty(userId)) {
            mapOfIds[userId] += factor;
        } else {
            mapOfIds[userId] = factor;
        }
    });

    for (let userId in mapOfIds) {
        if (mapOfIds.hasOwnProperty(userId)) {
            let factor = mapOfIds[userId];
            if (factor < 0) {
                removed.push(userId);
            } else if (factor > 0) {
                added.push(userId);
            }
        }
    }

    return {
        '+': added,
        '-': removed
    };
};
