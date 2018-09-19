pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract dPanc {

  event Upload (
    address indexed _from,
    string _date,
    string _hash
  );

  struct FileMetadata {
      string hash;
      bool exists;
  }

  struct UserDataStore {
    mapping(string => FileMetadata) dateToHash;
    string[] datesByMonthList;
  }

  mapping(address => UserDataStore) addressToUserDataStore;

  /// @param _date Formatted month date (YYYY-MM) of user's uploaded data
  /// @param _hash IPFS hash of data corresponding to _date
  function saveHash(string _date, string _hash) public {
    UserDataStore storage userDataStore = addressToUserDataStore[msg.sender];
    if (!userDataStore.dateToHash[_date].exists) {
      userDataStore.datesByMonthList.push(_date);
      userDataStore.dateToHash[_date].exists = true;
    }

    userDataStore.dateToHash[_date].hash = _hash;

    emit Upload(msg.sender, _date, _hash);
  }

  /// @param _date Formatted month date (YYYY-MM) of user's uploaded data
  /// @return hash IPFS hash of data corresponding to _date
  function getHash(string _date) public view returns (string hash) {
      return addressToUserDataStore[msg.sender].dateToHash[_date].hash;
  }

  /// @return list of dates that have IPFS hashes
  function getUploadedDates() public view returns (string[] dates) {
      return addressToUserDataStore[msg.sender].datesByMonthList;
  }
}
