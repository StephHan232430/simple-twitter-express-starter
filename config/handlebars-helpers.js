const moment = require('moment')
const helper = require('../_helpers')
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
  },
  hashtags: function(description, TweetCategories) {
    let tags = helper.hashtagOf(description)
    let transformedTags = []

    for (let i = 0; i < tags.length; i++) {
      transformedTag =
        '<a class="text-info" href="/tweets/' +
        TweetCategories[i].CategoryId +
        '" style="font-weight:bold;" >' +
        tags[i].trim() +
        '</a>'
      transformedTags.push(transformedTag)
    }

    let stringArray = []
    let result = ''

    if (description[0] !== '#') {
      for (let i = 0; i < tags.length; i++) {
        if (description.includes(tags[i])) {
          if (description.substring(0, description.indexOf('#')).length === 0) {
            stringArray.push('SPACE')
          } else {
            stringArray.push(description.substring(0, description.indexOf('#')))
          }
        }
        description = description.substring(
          description.indexOf('#') + tags[i].length - 1
        )
      }

      for (let j = 0; j < stringArray.length; j++) {
        if (stringArray[j] === 'SPACE') {
          result += '\xa0'
        } else {
          result += stringArray[j]
        }
        result += transformedTags[j]
      }

      return result + description
    } else {
      for (let i = 0; i < tags.length; i++) {
        if (description.includes('#')) {
          description = description.substring(tags[i].length)
          if (description.substring(0, description.indexOf('#')) === ' ') {
            stringArray.push('SPACE')
            description.trim()
          } else {
            stringArray.push(description.substring(0, description.indexOf('#')))
            description = description.substring(description.indexOf('#'))
          }
        }
      }

      for (let j = 0; j < transformedTags.length; j++) {
        result += transformedTags[j]
        if (stringArray[j] === 'SPACE') {
          result += '\xa0'
        } else {
          result += stringArray[j]
        }
      }

      return result + description
    }
  }
}
