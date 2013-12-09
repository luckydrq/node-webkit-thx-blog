/*var path = require('path')
var fs = require('fs')
*/
var $ = window.$
/*var config = require('../config/config')
var LocalStorage = require('./storage')

var localStorage = new LocalStorage()*/
var GITHUB_ACCOUNT_REG = /^[A-Za-z0-9]{1}\w*$/

module.exports.verifyUsername = function(username){
  username = $.trim(username)
  if(GITHUB_ACCOUNT_REG.test(username)) return true
  else                                  return false
}

module.exports.verifyPassword = function(password){
  password = $.trim(password)
  //at least 1 lowercase letter && 1 numeric && 7 characters
  if(/[a-z0-9]+/.test(password) && password.length >= 7) return true
  else                                                   return false
}

/*module.exports.save = function(account) {
  format(account)
  if(account.remember === true) resetDefault()

  var acc = {}
  acc[account.username] = {
    password: account.password,
    isDefault: account.isDefault
  }
  $.extend(config.users, acc)

}

module.exports.remove = function(account){
  format(account)

  if(config.users.hasOwnProperty(account.username)){
    if(account.isDefault){
      for (var user in config.users) {
        if(config.users.hasOwnProperty(user) && user.username !== account.username){
          user.isDefault = true
          break
        }
      }
    }
    delete config.users[account.username]

  }
}

module.exports.find = function(username) {
  var users = storage.get('users')
}

function resetDefault(){
  for(var user in config.users){
    if(config.users.hasOwnProperty(user)) user.isDefault = false
  }
}
function format(account){
  account.username = $.trim(account.username)
  account.password = $.trim(account.password)
  account.isDefault = !!account.isDefault
}*/
