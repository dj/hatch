var assert = require("assert")

// Example Test
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present (example)', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

