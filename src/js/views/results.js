var fs = require('fs');
var handlebars = require('handlebars');
var parser = require('babyparse');
var Search = require('../models/search.js');
var ResultsListView = require('./results-list.js');
var ResultsTableView = require('./results-table.js');

module.exports = Backbone.View.extend({
  el: $('#results-container'),

  initialize: function(options) {
    var self = this;

    // Initialize the Search model
    this.model = new Search({ q: options.queryString });
    this.model.fetch().done(function(){
      self.render()
    })

    // Initialize Sub View
    this.resultsListView = new ResultsListView();
    this.resultsTableView = new ResultsTableView();

    // Render on model change
    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    "change #results-subview": "changeSubview"
  },

  changeSubview: function(e) {
    if (e.target.value == 'Table') {
      // Empty the subview, render the table subview
    } else {
      // Empty the subview, render the tweet preview subview
    }
  },

  template: function(data) {
    var templateFile = fs.readFileSync('src/templates/results-view.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    return template(data);
  },

  render: function () {
    // Hack, will be replaced by resultset
    var csvData = parser.unparse(this.model.changed);
    var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);

    // Render the HTML
    var html = this.template({
      q: this.model.attributes.q,
      statuses: this.model.changed,
      hashtags: this._entities(this.model.changed, 'hashtags', 'text'),
      urls: this._entities(this.model.changed, 'urls', 'expanded_url'),
    });

    // Inject HTML into DOM
    this.$el.html(html);

    return this;
  },

  /*
   * Helpers
   */

  /*
   * _entities: Returns a unique list of entity attributes
   *
   * tweets:    A JSON list of statuses
   * entity:    Entity type (one of 'urls', 'hashtags', 'user_mentions'
   * attribute: The attribute of the entity to collect
   */
  _entities: function(tweets, entity, attribute) {
    var selectedEntity = _(tweets)
      .map(function each (tweet) {
        return tweet.entities;
      })
      .pluck(entity)
      .flatten()
      .pluck(attribute)
      .uniq()
      .value();

    return selectedEntity;
  },
});

