//external libs
var marked = require('marked')
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

var GitHubApi = require('github')
var github = new GitHubApi({
  version: '3.0.0',
  debug: true,
  protocol: 'https'
})


//load native modules
var app = require('./lib/app')
var user = require('./lib/user')
var config = require('./config/config')
var thx_config = config.thx || {}

//global vars
var g_user
var g_article = {}

$(document).ready(function() {
  var $app_content = $('#app_content')
  var $preview = $app_content.find('.preview')
  var $markdown = $app_content.find('.markdown')
  var $article = $app_content.find('.article')
  var $article_type = $app_content.find('.article-type')
  var $html = $app_content.find('.html')
  var $loginModal = $app_content.find('#loginModal')

  //load remote `thx` config
  var config_url = config.app.config_url
  $.ajax({
    url: config_url,
    dataType: 'json',
    timeout: 10000,
    success: function(remoteCfg) {
      config.thx = thx_config = remoteCfg.thx
    },
    complete: function(){
      thx_config.articles.forEach(function(article) {
        $article_type.append([
          '<li data-text="',
          article.text,
          '" data-type="',
          article.type,
          '" data-path="',
          article.path,
          '"><a>',
          article.text,
          '</a></li>'
        ].join(''))
      })
    }
  })
  $article_type.delegate('li', 'click', function() {
    $app_content.find('.article-type-default').html($(this).attr('data-text'))
    g_article.path = $(this).attr('data-path')
  })

  //tab switch
  $markdown.on('click', function() {
    $(this).addClass('active')
    $preview.removeClass('active')
    $html.hide()
    $article.show()
  })
  $('.preview').on('click', function() {
    $(this).addClass('active')
    $markdown.removeClass('active')
    $article.hide()

    var article = $.trim($article.val())
    if (article.length) {
      $html.html('loading').show()
      marked(article, function(err, content) {
        if (err) $html.html(err.message)
        else $html.html(content)
      })
    } else {
      $html.html('').show()
    }
  })

  //dialog
  var $gh_id = $loginModal.find('#gh_id')
  var $gh_password = $loginModal.find('#gh_password')
  var input_error_class = 'input-error'
  var error_handler = function(){$(this).addClass(input_error_class)}
  var normal_hander = function(){$(this).removeClass(input_error_class)}
  var keyup_handler = function(method){
    return function(){
      if($(this).val() == ''){
        $(this).trigger('normal')
        return
      }
      user[method].call(user, $(this).val()) ? $(this).trigger('normal') : $(this).trigger('error')
    }
  }
  $gh_id
    .on('error', error_handler)
    .on('normal', normal_hander)
    .on('keyup', keyup_handler('verifyUsername'))
  $gh_password
    .on('error', error_handler)
    .on('normal', normal_hander)
    .on('keyup', keyup_handler('verifyPassword'))

  $loginModal.find('.btn-publish-immediately').on('click', function(){
    if($gh_id.val() == '')$gh_id.trigger('error')
    if($gh_password.val() == '')$gh_password.trigger('error')
    if($loginModal.find(input_error_class).length == 0){
      $loginModal.modal('hide')
      g_user = {
        username: $.trim($gh_id.val()),
        password: $.trim($gh_password.val())
      }
      // re-trigger `click` handler
      $('.publish-btn').trigger('click')
    }
  })
  $loginModal.on('hidden.bs.modal', function(){
    $gh_id.trigger('normal')
    $gh_password.trigger('normal')
  })

  //publish article
  $('.publish-btn').on('click', function() {
    var $self = $(this)

    //article title
    var article_title = $.trim($('#article_title').val().replace(/\.md/, ''))
    if(!article_title.length){
      alert('请指定文章标题！')
      return
    }
    g_article.title = article_title

    //article content
    var article_content = $.trim($article.val())
    if(!article_content.length){
      alert('您的文章内容为空！')
      return
    }
    g_article.content = article_content

    //article path
    if(!g_article.path){
      alert('请选择文章类型！')
      return
    }

    //checkout login
    if(!g_user){
      $loginModal.modal()
      return
    }

    //change button state
    $self.addClass('disabled').html('正在发表...')

    //publish
    publishBlog({
      username: g_user.username,
      password: g_user.password,
      repo: thx_config.repo,
      ref: thx_config.ref,
      path: [g_article.path, g_article.title + '\.md'].join('\/'),
      filecontent: g_article.content
    }, function(err, results){
      if(err) alert(err.message)
      else alert('发表成功!')

      //reset button state
      $self.removeClass('disabled').html('发表文章')
    })
  })
})

//article publish api
//`require('async')` doesn't act normally in the context of node-webkit
function publishBlog(config, callback){
  var username = config.username
  var password = config.password
  var repo = config.repo
  var ref = config.ref
  var path = config.path
  var data = {FILE_CONTENT: config.filecontent}

  async.waterfall([
    //authenticate
    function(cb) {
      writeLog('authenticating...')
      var ex = null
      try {
        github.authenticate({
          type: 'basic',
          username: username,
          password: password
        })
      } catch (exception) {
        ex = exception
      }
      cb(ex)
    },

    //get => SHA_LASTEST_COMMIT
    function(cb) {
      writeLog('success')
      writeLog('fetch SHA_LASTEST_COMMIT...')
      github.gitdata.getReference({
        user: 'thx',
        repo: repo,
        ref: ref
      }, function(err, result) {
        var sha_last_commit = data.SHA_LASTEST_COMMIT = result.object.sha
        writeLog(sha_last_commit)
        cb(err, data)
      })
    },

    //get => SHA_BASE_TREE
    function(data, cb) {
      writeLog('fetch SHA_BASE_TREE...')
      github.gitdata.getCommit({
        user: 'thx',
        repo: repo,
        sha: data.SHA_LASTEST_COMMIT
      }, function(err, result) {
        var sha_base_tree = data.SHA_BASE_TREE = result.tree.sha
        writeLog(sha_base_tree)
        cb(err, data)
      })
    },

    //post => SHA_NEW_BLOB
    function(data, cb) {
      writeLog('fetch SHA_NEW_BLOB...')
      github.gitdata.createBlob({
        user: 'thx',
        repo: repo,
        content: data.FILE_CONTENT || '\/\/file content cannot be empty',
        encoding: 'utf-8'
      }, function(err, result) {
        var sha_new_blob = data.SHA_NEW_BLOB = result.sha
        writeLog(sha_new_blob)
        cb(err, data)
      })
    },

    //post => SHA_NEW_TREE
    function(data, cb) {
      writeLog('fetch SHA_NEW_TREE...')
      github.gitdata.createTree({
        user: 'thx',
        repo: repo,
        tree: [{
          path: path,
          type: 'blob',
          mode: '100644',
          sha: data.SHA_NEW_BLOB
        }],
        base_tree: data.SHA_BASE_TREE
      }, function(err, result) {
        var sha_new_tree = data.SHA_NEW_TREE = result.sha
        writeLog(sha_new_tree)
        cb(err, data)
      })
    },

    //post => SHA_NEW_COMMIT
    function(data, cb) {
      writeLog('fetch SHA_NEW_COMMIT...')
      github.gitdata.createCommit({
        user: 'thx',
        repo: repo,
        message: 'publish blog via github api',
        tree: data.SHA_NEW_TREE,
        parents: [data.SHA_LASTEST_COMMIT]
      }, function(err, result) {
        var sha_new_commit = data.SHA_NEW_COMMIT = result.sha
        writeLog(sha_new_commit)
        cb(err, data)
      })
    },

    //post => new reference
    function(data, cb) {
      writeLog('push commit...')
      github.gitdata.updateReference({
        user: 'thx',
        repo: repo,
        ref: ref,
        sha: data.SHA_NEW_COMMIT,
        force: true
      }, function(err, result) {
        if (err) {
          cb(err)
        } else {
          writeLog('success')
          cb()
        }
      })
    }

  ], function(err, results) {
    if (err) writeLog(err.message)
    callback && callback(err, results)
  })

  function writeLog(msg){
    console.log(msg)
  }
}
