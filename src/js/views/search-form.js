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
    $('#query').popover();
    $('#lang').popover();
     $('#result_type').popover();
      $('#until').popover();
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

  // I'm sorry.
  initSpinner: function() {
    var opts = {
      lines: 13, // The number of lines to draw
      length: 20, // The length of each line
      width: 10, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '15em', // Top position relative to parent
      left: '45%' // Left position relative to parent
    };

    var spinner = new Spinner(opts).spin();
    $('#results-container').append(spinner.el);
  },

  search: function(e) {
    e.preventDefault();
    // TODO: clean up to prevent zombie views
    var resultsContainer = $('#results-container')
    resultsContainer.empty();

    // Loading Spinner
    this.initSpinner();

    // A list of pairs of
    // string: a url query parameter + "="
    // val: the value from the matching form input
    var params = [
      { string: 'q=', val: $('#query').val() },
      { string: 'lang=', val: $('#lang').val() },
      { string: 'result_type=', val: $('#result_type').val() },
      { string: 'until=', val: $('#until').val() },
      { string: 'max_results=', val: $('#max-results').val().toString() }
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

