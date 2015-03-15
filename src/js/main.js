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
    this.render();
  },

  el: $('#search-form-container'),

  template: function() {
    var templateFile = fs.readFileSync('src/templates/search-form.hbs', 'utf8');
    return handlebars.compile(templateFile);
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

// View for rendering a list of tweets
var ResultsTableView = Backbone.View.extend({
  el: $('#results-container'),

  initialize: function() {
    var self = this;
    this.render();
  },

  render: function (data) {
    // var tweets = [];
    // _.each(data, function(k,v) {
    //   tweets.push(k);
    // });
    // var data = {
    //   tweets: tweets
    // };

    // Dummy data
    var mockData = fs.readFileSync('src/js/search-response.json', 'utf8'),
        response = JSON.parse(mockData);

    var templateFile = fs.readFileSync('src/templates/tweet.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    var html = template({ statuses: response.statuses });
    console.log(html);
    this.$el.html(html);
    return this;
  }
});

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

  searchFormView: null,
  resultsTableView: null,

  initialize: function() {
    this.on('route:home', function() {
      this.searchFormView = new SearchFormView();
      this.resultsTableView = new ResultsTableView();
    });
  },
});

var router = new Router();

// var resultsTableView = new ResultsTableView();
// var headerView = new SearchFormView();

var app = {}

Backbone.history.start();
