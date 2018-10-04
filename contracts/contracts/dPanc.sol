pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract dPanc {

  event UserRegister (
    address indexed _from,
    string _dbAddress
  );

  struct UserDb {
      bool exists;
      string dbAddress;
  }

  mapping(address => UserDb) addressToDb;

  function registerUser(string _dbAddress) public {
      UserDb storage userDb = addressToDb[msg.sender];

      // Error if user address already has db address saved
      require(!userDb.exists, 'user-db-already-exists');

      userDb.dbAddress = _dbAddress;
      userDb.exists = true;

      emit UserRegister(msg.sender, _dbAddress);
  }

  function getDbAddress() public view returns (string) {
      return addressToDb[msg.sender].dbAddress;
  }
}