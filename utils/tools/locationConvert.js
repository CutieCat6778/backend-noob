module.exports = (res) => {
    let location = "";
    if (res) {
        res = res.toString()
        if (res.includes('/')) {
            const split = res.split('/');
            const split2 = split[1].split('-');
            location = [split[0], split2[0], split2[1]];
        } else if (res.includes('-')) {
            const split = res.split('-');
            location = [null, split[0], split[1]];
        } else {
            location = [null, res, null];
        }
    } else location = null;
    return location;
}