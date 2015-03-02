var fs = require('fs');
var _ = require('underscore');
var Backbone = require('backbone');
var handlebars = require('handlebars');

// Backbone assumes jQuery is in the global namespace
var $ = require('jquery');
Backbone.$ = $;

// View for rendering a list of tweets
var ResultsTableView = Backbone.View.extend({
  el: $('#results-table'),
  initialize: function() {
    // Bind the current context to the render method
    _.bindAll(this, 'render');
    this.render();
  },
  defaultTweets: {
    tweets: [
      { user: '@djhrtmn', text: 'lorem ipsum sit amet delor' },
      { user: '@djhrtmn', text: 'lorem ipsum sit amet delor' },
      { user: '@djhrtmn', text: 'lorem ipsum sit amet delor' },
      { user: '@djhrtmn', text: 'lorem ipsum sit amet delor' },
      { user: '@djhrtmn', text: 'lorem ipsum sit amet delor' }
    ]
  },
  template: handlebars.compile(fs.readFileSync('src/templates/tweet.hbs', 'utf8')),
  render: function () {
    var html = this.template(this.defaultTweets);
    $(this.el).append(html);
    return this;
  }
});

var app = {}
app.Hatch = new ResultsTableView();

