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

  // events: {
  //   'click #download': 'downloadCSV'
  // },

  // downloadCSV: function(e) {
  //   e.preventDefault();
  // },

  render: function (data) {
    var tweets = [];
    _.each(data, function(k,v) {
      tweets.push(k);
    });

    this.data = tweets;

    var templateFile = fs.readFileSync('src/templates/tweet.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    var csvData = parser.unparse(this.data);
    var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);

    var html = template({
      statuses: this.data,
      href: href,
    });

    this.$el.html(html);
    return this;
  }
});

