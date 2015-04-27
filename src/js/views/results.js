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
    this.model.fetch({
      success: function(model, response, options) { return self.render() },
      error: function(model, response, options) {
        $('.alert').removeClass('hidden')
        $('#err-msg').text(response.statusText)
      }
    })

    // Render on model change
    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    "click #results-table-pane-btn": "initTable",
  },

  initTable: function(e) {
    // Init the results table with model attributes
    $('#results-table').bootstrapTable({
        // Convert model attributes from object to list of objects
        data: _.map(this.model.changed)
    });
  },

  template: function(data) {
    var templateFile = fs.readFileSync('src/templates/results-view.hbs', 'utf8'),
        template = handlebars.compile(templateFile);

    return template(data);
  },

  render: function () {
    // Render the HTML
    var html = this.template({
      q: this.model.attributes.q,
      statuses: _.map(this.model.changed),
      hashtags: this._entities(this.model.changed, 'hashtags', 'text'),
      urls: this._entities(this.model.changed, 'urls', 'expanded_url'),
      href: '/api/search.csv?' + this.model.attributes.q
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
      .countBy(attribute)
      .pairs()
      .map(function each(entity) {
        return {
          val: entity[0],
          count: entity[1]
        }
      })
      .sortBy('count')
      .reverse()
      .take(10)
      .value();

    return selectedEntity;
  },
});

handlebars.registerHelper ('truncate', function (str, len) {
  if (str.length > len) {
    var new_str = str.substr (0, len+1);

    while (new_str.length) {
      var ch = new_str.substr ( -1 );
      new_str = new_str.substr ( 0, -1 );

      if (ch == ' ') {
        break;
      }
    }

    if ( new_str == '' ) {
      new_str = str.substr ( 0, len );
    }

    return new handlebars.SafeString ( new_str +'...' );
  }
  return str;
});

