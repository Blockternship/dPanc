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

  function registerUser(address _addr, string _dbAddress) public {
      UserDb storage userDb = addressToDb[_addr];

      // Error if user address already has db address saved
      require(!userDb.exists, 'user-db-already-exists');

      userDb.dbAddress = _dbAddress;
      userDb.exists = true;

      emit UserRegister(_addr, _dbAddress);
  }

  function getDbAddress(address _addr) public view returns (string) {
      return addressToDb[_addr].dbAddress;
  }

  function deleteUser(address _addr) public {
      addressToDb[_addr].dbAddress = "";
      addressToDb[_addr].exists = false;
  }
}