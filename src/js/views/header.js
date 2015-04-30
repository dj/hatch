var Backbone = require('backbone');
var fs = require('fs');
var handlebars = require('handlebars');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  initialize: function() {
    var self = this;
    this.loggedIn(function(val){
      self.computeds.loggedIn = val;
      self.render();
    });
  },

  el: $('#header-container'),

  events: {
    "click #logout": "logout"
  },

  computeds: {
    "loggedIn": false,
  },

  template: function() {
    var templateFile = fs.readFileSync('src/templates/header.hbs', 'utf8');
    return handlebars.compile(templateFile)({loggedIn: this.computeds.loggedIn });
  },

  logout: function(e) {
    e.preventDefault();
    $(location).attr('href','http://localhost:8080/api/logout');
  },

  loggedIn: function(callback) {
    $.ajax("/user", {
        type: "GET",
        dataType: "json",
        success: function() {
          return callback(true);
        },
        error: function() {
          return callback(false);
        }
    });
  },

  render: function() {
    var html = this.template();
    window.that = this;
    this.$el.append(html);
    return this;
  },
});
