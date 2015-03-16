var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
var fs = require('fs');
var handlebars = require('handlebars');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  el: $('#results-container'),

  initialize: function() {
    var self = this;
    this.render();
  },

  render: function (data) {
    var tweets = [];
    _.each(data, function(k,v) {
      tweets.push(k);
    });
    var data = {
      statuses: tweets
    };

    var templateFile = fs.readFileSync('src/templates/tweet.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    var html = template(data);
    console.log(html);
    this.$el.html(html);
    return this;
  }
});

