var HelloWorld = artifacts.require("./HelloWorld.sol");

contract('HelloWorld', function(accounts) {
  it("should output Hello World", async function() {
    var instance = await HelloWorld.deployed();
    var str = await instance.getHelloWorld();
    assert.equal(str, "Hello World");
  });
});
