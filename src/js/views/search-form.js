var fs = require('fs');
var handlebars = require('handlebars');

var SearchModel = require('../models/search.js');
var ResultsView = require('./results-view.js');

module.exports = Backbone.View.extend({
  initialize: function() {
    this.render();
  },

  el: $('#search-form-container'),

  template: function() {
    var templateFile = fs.readFileSync('src/templates/search-form.hbs', 'utf8');
    return handlebars.compile(templateFile);
  },

  render: function(data) {
    var html = this.template()
    this.$el.append(html);
  },

  events: {
    "submit form": "search",
  },

  search: function(e) {
    e.preventDefault();
    // TODO: clean up to prevent zombie views
    $('#results-container').empty();

    var params = [
      { string: 'q=', val: $('#query').val() },
      { string: 'lang=', val: $('#lang').val() },
      { string: 'result_type=', val: $('#result_type').val() },
      { string: 'until=', val: $('#until').val() }
    ]

    // Reject empty parameters
    var queryString = _.chain(params)
      .filter(function(param) { return param.val })
      // URI encode values
      .map(function(param) { return param.string + encodeURIComponent(param.val) })
      .map(_.escape)
      .value()
      .join('&');

    var search = new SearchModel();

    search.fetch({
      data: queryString,
      success: function(data) {
        var Results = new ResultsView();
        Results.render(queryString, data.toJSON());
      }
    });

  }
});

