## Data Storage

This document details how user data will be stored.

### IPFS (Inter-Planetary File System)

IPFS is a peer-to-peer distributed file system that functions like a decentralized and distributed key-value database.

You give IPFS the data content to save, and it returns a hash (of the data content) that is used to retrieve the data.

Giving two data files that contain the same content will return the same hash.

### OrbitDB

OrbitDB is a distributed peer-to-peer database that leverages IPFS as data storage.

The fundamental challenge with IPFS is that modifying the data content will result in a different key generated, so it is not suitable for updating information. OrbitDB eliminates this challenge by building a layer on top of IPFS to manage the mappings internally.

Creating an OrbitDB database will give an address that you use in further operations (this address will not change as the data changes).

We will leverage OrbitDB to assign each user their own OrbitDB database.

### Ethereum Contract to Store OrbitDB Database Address

User data is not stored directly on the Ethereum blockchain as it not suited for big data storage.

An Etheruem contract will be deployed to store the user's OrbitDB database address by Ethereum address.

### End-to-End Flow

**"date" for MVP refers to a month (YYYY-MM) since we require a whole month's data to be uploaded at once**

1. User fills out upload form with time series data file attached
2. Determine data formatted date YYYY-MM
3. Check dPanc contract to see if user has an OrbitDB address already
    1. If user db address does not exist in contract, then create an OrbitDB db with name as a salted keccak256 hash of user's ETH address and save in contract (requires a transaction)
    2. If user db address exists in contract, then use the saved address to open OrbitDB db
4. Save user data with key as the formatted date in OrbitDB

### Data Model

The data stored into IPFS will be in JSON format:

```
{
  "glucose": [
    [TIMESTAMP, VALUE (mg/dL)],
    ...
  ]
}
```

The list of data points (timestamp + value) are under a `glucose` key as we may want to store other types of relevant data points in the future.

### Contract (User Data Store)

**"date" for MVP refers to a month (YYYY-MM) since we require a whole month's data to be uploaded at once**

```
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
```

### Data Retrieval

#### Retrieving Last X Months

Since we are limiting data storage to a monthly basis for the MVP, we can derive the keys based on the query.

Ex. If we want the past 3 months worth of data and this month's date is 2018-10, then we will be retrieving data for the keys `2018-10`, `2018-09`, and `2018-08`.
