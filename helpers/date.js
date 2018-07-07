module.exports = {
    isoFromTimestamp(timestamp) {
        return new Date(timestamp * 1000).toISOString().slice(0, -5);
    }
};
