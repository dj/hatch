require('bootstrap')
var fs = require('fs');
var handlebars = require('handlebars');

// TODO: Stop hardcoding host, configure dev/staging/prod host with gulp
$.ajaxPrefilter(function( options, originalOptions, jqXHR) {
  options.url = "http://localhost:8080/api" + options.url;
});

// Models
var User = require('./models/user.js');

// Views
var SearchFormView = require('./views/search-form.js');
var LoginFormView = require('./views/login-form.js');
var HeaderView = require('./views/header.js')

var Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  searchFormView: null,
  resultsTableView: null,
  loginFormView: null,
  headerView: new HeaderView(),

  initialize: function() {
    var self = this;

    this.on('route:home', function() {
      self.currentUser = new User();
      self.currentUser.fetch({
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
