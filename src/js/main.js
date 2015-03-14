var $ = require('jquery');
var fs = require('fs');
var _ = require('underscore');
var Backbone = require('backbone');
var handlebars = require('handlebars');

// Backbone assumes jQuery is in the global namespace
Backbone.$ = $;

$.ajaxPrefilter(function( options, originalOptions, jqXHR) {
  options.url = "http://localhost:8080/api" + options.url;
});


var User = Backbone.Model.extend({
  initialize: function() {
    this.currentUser = new User();
    this.fetch({
      success: function(user) {
        console.log('success!!');
      },
      error: function(d) {
        console.log('error!!');
      }
    });
  },

  defaults: {
    username: '',
    id: ''
  },

  url: '/user'
});

var Tweets = Backbone.Model.extend({
  defaults: {
    data: {}
  },

  url: '/search'
});

var SearchFormView = Backbone.View.extend({
  initialize: function() {
    var self = this;

  },

  el: $('#search-form'),

  template: function() {
    var templateFile = fs.readFileSync('src/templates/search-form.hbs');

    return handlebars.compile(templateFile, 'utf8');
  },

  render: function(data) {
    var html = this.template()
    this.$el.append(html);
  },

  events: {
    "submit": "search",
  },

  search: function(e) {
    e.preventDefault();
    var q = 'q=' + $('#query').val(),
        lang = 'lang='  + $('#lang').val(),
        result_type = 'result_type' + $('#result-type');

    var tweets = new Tweets();
    var search =  tweets.fetch({
      data: [q, lang].join('&'),
      success: function(data) {
        var resultsTableView = new ResultsTableView();
        resultsTableView.render(data.toJSON());
      }
    });
  }
});

// // View for rendering a list of tweets
// var ResultsTableView = Backbone.View.extend({
//   el: $('#results_container'),

//   initialize: function() {
//     this.render();
//   },

//   template: handlebars.compile(fs.readFileSync('src/templates/tweet.hbs', 'utf8')),

//   render: function (data) {
//     var tweets = [];
//     _.each(data, function(k,v) {
//       tweets.push(k);
//     });
//     var data = {
//       tweets: tweets
//     };
//     var html = this.template(data);
//     $(this.el).prepend(html);
//     return this;
//   }
// });

var LoginFormView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  el: $('#login-form-container'),

  events: {
    "submit": "login"
  },

  template: function() {
    var templateFile = fs.readFileSync('src/templates/login-form.hbs', 'utf8');

    return handlebars.compile(templateFile);
  },

  login: function(e) {
    e.preventDefault();
    $(location).attr('href','http://localhost:8080/api/oauth');
  },

  render: function() {
    var html = this.template();
    this.$el.append(html);
    return this;
  },
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  currentUser: null,

  loginFormView: null,

  initialize: function() {
    if (this.currentUser) {
      console.log('logged in')
    } else {
      console.log('not logged in')
      this.loginFormView = new LoginFormView();
    }

    this.on('route:home', function() {
      // headerView.render();
    });
  },
});

var router = new Router();

// var resultsTableView = new ResultsTableView();
// var headerView = new SearchFormView();

var app = {}

Backbone.history.start();
