var Backbone = require('backbone');
var fs = require('fs');
var handlebars = require('handlebars');
var $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  initialize: function() {
    this.render();
    // yolo
    var self = this;
    $( "#loginModal" ).bind( "click", function() {
      self.login();
    });
  },
  el: $('#login-form-container'),

  events: {
    "click #loginModal": "login"
  },

  template: function() {
    var templateFile = fs.readFileSync('src/templates/login-form.hbs', 'utf8');
    return handlebars.compile(templateFile);
  },

  login: function(e) {
    $(location).attr('href','http://localhost:8080/api/oauth');
  },

  render: function() {
    var html = this.template();
    this.$el.append(html);
    return this;
  },
});
