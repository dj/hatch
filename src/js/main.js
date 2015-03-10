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

var HeaderView = Backbone.View.extend({
  initialize: function() {
    var self = this;
    this.user = new User();
    this.user.fetch({
      success: function(user) {
        self.render({user: user.toJSON(), login: true});
      },
      error: function(d) {
        self.render({login: false});
      }
    });
  },

  el: $('#header_container'),

  render: function(data) {
    var template = _.template($("#header_template").html());
    console.log(data);
    this.$el.html( template(data) );
  },

  events: {
    "click #search": "search",
    "click button": "login"
  },

  login: function( event ) {
    $(location).attr('href','http://localhost:8080/api/oauth');
  },

  search: function( data ) {
    var q = "q=" + $(".search").val();
    var tweets = new Tweets();
    var search =  tweets.fetch({
      data: q,
      success: function(data) {
        var resultsTableView = new ResultsTableView();
        resultsTableView.render(data.toJSON());
      }
    });
  }
});

// View for rendering a list of tweets
var ResultsTableView = Backbone.View.extend({
  el: $('#results_container'),

  initialize: function() {
    // Bind the current context to the render method
    // this.render();
  },

  defaultTweets: {
    tweets: [
      { user: {name:'@djhrtmn'}, text: 'lorem ipsum sit amet delor' },
      { user: {name:'@djhrtmn'}, text: 'lorem ipsum sit amet delor' }
    ]
  },

  template: handlebars.compile(fs.readFileSync('src/templates/tweet.hbs', 'utf8')),

  render: function (data) {
    var tweets = [];
    _.each(data, function(k,v) {
      tweets.push(k);
    });
    var data = {
      tweets: tweets
    };
    var html = this.template(data);
    $(this.el).prepend(html);
    return this;
  }
});


var Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  }
});

var router = new Router();

var resultsTableView = new ResultsTableView();
var headerView = new HeaderView();

router.on('route:home', function() {
  headerView.render();
});

var app = {}

Backbone.history.start();
