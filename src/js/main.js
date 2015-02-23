var $ = require('jquery');
var fs = require('fs');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var ResultsTableView = Backbone.View.extend({
  el: $('#results-table'),
  initialize: function() {
    console.log('init');
    _.bindAll(this, 'render');
    this.render();
  },
  defaultTweets: { user: '@djhrtmn', text: 'lorem ipsum sit amet delor' },
  template: _.template(fs.readFileSync('src/templates/tweet.html', 'utf8')),
  render: function(){
    var html = this.template(this.defaultTweets);
    console.log(html);
    $(this.el).append(html);
    return this;
  }
});

var app = {}
app.Hatch = new ResultsTableView();

