var dPanc = artifacts.require("./dPanc.sol");

contract('dPanc', function(accounts) {
  const USER = accounts[0],
        OTHER_USER = accounts[1];
        
  const firstDate = "20180917",
        firstHash = "123",
        secondDate = "20181017",
        secondHash = "456";

  let instance;

  before(async () => {
    instance = await dPanc.deployed();
  });

  describe("when saving IPFS hash", async function() {
    it("should save IPFS hash correctly", async function() {
      await instance.saveHash(firstDate, firstHash);
      const actualHash = await instance.getHash(firstDate);

      assert.equal(actualHash, firstHash);
    });

    it("should save multiple hashes from same user correctly", async function() {
      await instance.saveHash(secondDate, secondHash);
      const actualSecondHash = await instance.getHash(secondDate);
      assert.equal(actualSecondHash, secondHash);

      // Verify firstHash still exists
      const actualFirstHash = await instance.getHash(firstDate);
      assert.equal(actualFirstHash, firstHash);
    });

    it("should correctly save hash from another user", async function() {
      const otherUserDate = "20180917",
            otherUserHash = "789";
      await instance.saveHash(otherUserDate, otherUserHash, { from: OTHER_USER });
      const actualHash = await instance.getHash(firstDate, { from: OTHER_USER });
      assert.equal(actualHash, otherUserHash);

      // Verify USER (first user) data still exists
      const firstUserActualHash = await instance.getHash(firstDate, { from: USER });
      assert.equal(firstUserActualHash, firstHash);
    });

    it("should overwrite hash if specified date already has a hash set", async function() {
      const newHash = "321";
      await instance.saveHash(firstDate, newHash);
      const actualHash = await instance.getHash(firstDate);

      assert.equal(actualHash, newHash);
    });
  });

  // This code bugs out... Truffle probably can't handle experimental ABIEncoderV2 features.
  // describe("when getting uploaded dates", async function() {
  //   it("should correctly return the list of user uploaded dates", async function() {
  //     await instance.saveHash(firstDate, firstHash);
  //     await instance.saveHash(secondDate, secondHash);
  // 
  //     const dates = await instance.getUploadedDates({from: USER});
  //   });
  // });
});
