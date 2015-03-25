var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
var fs = require('fs');
var handlebars = require('handlebars');
var parser = require('babyparse');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  el: $('#results-container'),

  initialize: function() {
    var self = this;
    this.render();
  },

 render: function (queryString, data) {
    var tweets = [];
    _.each(data, function(k,v) {
      tweets.push(k);
    });

    var templateFile = fs.readFileSync('src/templates/tweet.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    var csvData = parser.unparse(tweets);
    var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);

    var html = template({
      queryString: queryString,
      statuses: tweets,
      href: href,
    });

    this.$el.html(html);
    return this;
  }
});

