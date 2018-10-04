var dPanc = artifacts.require("./dPanc.sol");

contract('dPanc', function(accounts) {
  const USER = accounts[0],
        OTHER_USER = accounts[1];

  const FIRST_DB_ADDRESS = "/orbitdb/1/first-db",
        SECOND_DB_ADDRESS = "/orbitdb/2/second-db";

  let instance;

  before(async () => {
    instance = await dPanc.deployed();
  });

  describe("when saving db address", async function() {
    it("should save db address correctly", async function() {
      await instance.registerUser(FIRST_DB_ADDRESS);
      const actualDbAddress = await instance.getDbAddress();

      assert.equal(actualDbAddress, FIRST_DB_ADDRESS);
    });

    it("should correctly save db address from another user", async function() {
      await instance.registerUser(SECOND_DB_ADDRESS, { from: OTHER_USER });

      const actualDbAddress = await instance.getDbAddress({ from: OTHER_USER });
      assert.equal(actualDbAddress, SECOND_DB_ADDRESS);

      // Verify USER (first user) data still exists
      const firstActualDbAddress = await instance.getDbAddress({ from: USER });
      assert.equal(firstActualDbAddress, FIRST_DB_ADDRESS);
    });
  });
});
