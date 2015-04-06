var fs = require('fs');
var handlebars = require('handlebars');
var parser = require('babyparse');

module.exports = Backbone.View.extend({
  el: $('#results-container'),

  initialize: function() {
    var self = this;
    this.render();
  },

  mockUrls: [
    'http://t.co/XjunzuLCIU',
    'http://t.co/XkbVWCIMDW',
    'http://t.co/RiShZYH6ku'
  ],

  mockHashtags: [
    '#YOLO', '#FOMO', '#EVOO'
  ],

  render: function (queryString, data) {
    var tweets = _.map(data, function(tweet){
      return tweet;
    });

    var templateFile = fs.readFileSync('src/templates/results-table.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    var csvData = parser.unparse(tweets);
    var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);

    var html = template({
      queryString: queryString,
      hashtags: this.mockHashtags,
      urls: this.mockUrls,
      statuses: tweets,
      href: href,
    });

    this.$el.html(html);
    return this;
  }
});

