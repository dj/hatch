var fs = require('fs');
var handlebars = require('handlebars');

var SearchModel = require('../models/search.js');
var ResultsView = require('./results.js');

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
    "click #save-advanced-search": "saveAdvancedSearch",
  },

  saveAdvancedSearch: function(e) {
    // Close modal
    $('#advanced-search-modal').modal('hide');

    // Get the form input
    var all = $('#all-of-these-words').val();

    var any = $('#any-of-these-words').val().split(',').join(' OR');

    var none = (function(){
      // Array of words to ignore
      var words = $('#none-of-these-words').val().split(',')

      return _.map(words, function(word) {
        // Remove whitespace, append - sign
        return '-' + word.trim();
      }).join(' ');
    })()

    var from = (function(){
      var user = $('#from-this-user').val();
      return 'from:' + user
    })()

    // Fill in the query form
    $('#query').val([all, any, none, from].join(' '))
  },

  search: function(e) {
    e.preventDefault();
    // TODO: clean up to prevent zombie views
    $('#results-container').empty();

    // A list of pairs of
    // string: a url query parameter + "="
    // val: the value from the matching form input
    var params = [
      { string: 'q=', val: $('#query').val() },
      { string: 'lang=', val: $('#lang').val() },
      { string: 'result_type=', val: $('#result_type').val() },
      { string: 'until=', val: $('#until').val() }
    ]

    // Returns a query string from the list of params
    var queryString = _.chain(params)
      .filter(function(param) { return param.val })
      // URI encode values
      .map(function(param) { return param.string + encodeURIComponent(param.val) })
      .map(_.escape)
      .value()
      .join('&');

    var results = new ResultsView({
      queryString: queryString
    });
  }
});

