module.exports = Backbone.Model.extend({
  defaults: {
    username: '',
    id: ''
  },

  url: '/user'
});

