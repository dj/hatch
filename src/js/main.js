var $ = require('jquery');
var fs = require('fs');
var _ = require('underscore');
var Backbone = require('backbone');

var HatchAppView = Backbone.View.extend({
  el: '#hatch-app',
  defaultTweets: { user: '@djhrtmn', text: 'lorem ipsum sit amet delor' },
  template: _.template(fs.readFileSync('src/templates/tweet.html', 'utf8')),
  render: function(){
    $(this.el).html(this.template(defaultTweets));
    return this;
  }
})

var app = {}
app.Hatch = new HatchAppView();
