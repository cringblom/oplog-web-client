import icdCodes from './KVA2017v1.json'
import _ from 'lodash'


export default {
  filterIcdCodes: function(searchString) {
    searchString = searchString.toLowerCase()
    var filteredIcdCodes = _.filter(icdCodes, function(icdCode) {
      var longString = icdCode.icd + ' ' + icdCode.name
      var stringToMatch = longString.toLowerCase()
      if (stringToMatch.includes(searchString)) {
        return true
      }
      return false
    })
    var firstTenResults = _.take(filteredIcdCodes, 7)
    _.forEach(firstTenResults, function(icdCode) {
      icdCode.value = icdCode.icd + ' ' + icdCode.name
    })
    return firstTenResults
  },
  nameForIcd(anIcd) {
    var icd = anIcd.toUpperCase()
    var icdItem = _.find(icdCodes, function(icdItem) {
      return icdItem.icd == icd
    })
    if (icdItem) {
      return icdItem.name
    }
    return "hello"
  }
}
