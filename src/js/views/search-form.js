var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var fs = require('fs');
var handlebars = require('handlebars');

Backbone.$ = $;

var SearchModel = require('../models/search.js');
var ResultsTableView = require('./results-table.js');

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
    "submit": "search",
  },

  search: function(e) {
    e.preventDefault();
    // TODO: clean up to prevent zombie views
    $('#results-container').empty();

    var q           = 'q=' + $('#query').val(),
        lang        = 'lang='  + $('#lang').val(),
        result_type = 'result_type=' + $('#result-type').val(),
        until       = 'until=' + $('#until').val();

    var search = new SearchModel();
    search.fetch({
      data: [q, lang, result_type, until].join('&'),
      success: function(data) {
        var ResultsTable = new ResultsTableView();
        ResultsTable.render(data.toJSON());
      }
    });
  }
});

