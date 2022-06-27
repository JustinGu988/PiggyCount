const helpers = {
    returnSelected: function (option, value) {
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    }
}

module.exports.helpers = helpers