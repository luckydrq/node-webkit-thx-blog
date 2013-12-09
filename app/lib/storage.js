/*
var $ = window.$ || window.jQuery

function LocalStorage(
  this._storage = window.localStorage
  this._storage_key = "_thx_app_storage"
){}

Object.defineProperty(LocalStorage.prototype, 'users', {
  value: function(){
    var data = JSON.parse(this._get(this._storage_key)) || {}
    return data.users || {}
  }
})

LocalStorage.prototype.findUser = function(user){
  if($.isPlainObject(user)) user = user.username
  Object.keys(this.users).forEach(function(name){
    if(name === username) return this.users[name]
  })
  return null
}

LocalStorage.prototype.addUser = function(user){
  if($.isPlainObject(user)){

  }
}

//private api
LocalStorage.prototype._set = function(key, value){
  if($.isPlainObject(value)) value = JSON.stringify(value)
  try{
    _storage.setItem(key, value)
  }
  catch(ex){
    console.log(ex.message)
    this.clear()
  }
}
LocalStorage.prototype._get = function(key){
  return _storage.getItem(key)
}
LocalStorage.prototype._remove = function(key){
  _storage.removeItem(key)
}
LocalStorage.prototype._clear = function(){
  _storage.clear()
}

module.exports = LocalStorage

function format(user){
  if($.isPlainObject(user)){
    user.username = $.trim(user.username)

  }
}*/