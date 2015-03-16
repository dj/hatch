var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var fs = require('fs');
var handlebars = require('handlebars');

// Backbone assumes jQuery is in the global namespace
Backbone.$ = $;

// TODO: Stop hardcoding host, configure dev/staging/prod host with gulp
$.ajaxPrefilter(function( options, originalOptions, jqXHR) {
  options.url = "http://localhost:8080/api" + options.url;
});

// Models
var User = require('./models/user.js');

// Views
var SearchFormView = require('./views/search-form.js');
var LoginFormView = require('./views/login-form.js');

var Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  searchFormView: null,
  resultsTableView: null,
  loginFormView: null,

  initialize: function() {
    var self = this;

    this.on('route:home', function() {
      this.currentUser = new User();
      this.currentUser.fetch({
        success: function(user) {
          self.searchFormView = new SearchFormView();
        },
        error: function(d) {
          self.loginFormView = new LoginFormView();
        }
      });

    });
  },
});

var router = new Router();

Backbone.history.start();
