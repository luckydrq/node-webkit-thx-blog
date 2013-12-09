var fs = require('fs')
var path = require('path')

//external lib
var jade = require('jade')

//private variables
var jadeFn = {}
var $ = window.$ || window.jQuery
var $content = $('#app_content')

exports.navigate = function(view, data){
  if(!~view.indexOf('.jade')) view += '.jade'
  view = path.join('views/', view)
  if(fs.existsSync(view)){
    //var $content = $('#app_content')
    $content.html('loading...')
    var fn = jadeFn[view] || (jadeFn[view] = jade.compile(fs.readFileSync(view, {encoding: 'utf-8'})))
    $content.html(fn(data || {}))
  }
}