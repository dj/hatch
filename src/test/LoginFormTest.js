//Login Form View Tests

var LoginForm = require('../js/views/login-form.js');
  describe('Login Form View', function(){
  it("creates a model and adds it to its collection when none is passed", function(){
    view = new LoginForm;
    view.render;
    assert.equal(view.collection.length, 1);	
 })
})








