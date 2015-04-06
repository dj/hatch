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

  template: function(data) {
    var templateFile = fs.readFileSync('src/templates/results-view.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    return template(data);
  },

  render: function (queryString, data) {
    var csvData = parser.unparse(_.map(data));
    var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);

    var html = this.template({
      queryString: queryString,
      hashtags: this.mockHashtags,
      urls: this.mockUrls,
      statuses: data,
      href: href,
    });

    this.$el.html(html);
    return this;
  }
});

