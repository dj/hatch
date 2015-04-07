module.exports = Backbone.Model.extend({
  initialize: function(options) {
    this.options = options;
  },

  url: function() {
    return '/search?' + this.options.q;
  }

});

