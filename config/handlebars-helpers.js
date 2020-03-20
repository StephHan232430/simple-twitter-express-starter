const moment = require('moment')
module.exports = {
  ifCond: function(a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifNotCond: function(a, b, options) {
    if (a !== b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function(a) {
    return moment(a).format('YYYY-MM-DD hh:mm a')
  },
  shortComment: function(a) {
    if (a.length > 50) {
      return a.substring(0, 50) + '.....'
    } else {
      return a
    }
  },
  inc: function(value, options) {
    return parseInt(value) + 1
  },
  ifHashtags: function(description, symbol, options) {
    if (description.includes(symbol)) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}
