## Data Storage

This document details how user data will be stored.

### IPFS (Inter-Planetary File System)

IPFS is a peer-to-peer distributed file system that functions like a decentralized and distributed key-value database.

You give IPFS the data content to save, and it returns a hash (of the data content) that is used to retrieve the data.

Giving two data files that contain the same content will return the same hash.

### Ethereum Contract to Store IPFS Hash Metadata

User data is not stored directly on the Ethereum blockchain as it not suited for big data storage.

An Etheruem contract will be deployed to maintain the IPFS hash metadata of a user's store and the global store.

### End-to-End Flow

**"date" for MVP refers to a month (YYYY-MM) since we require a whole month's data to be uploaded at once**

1. User fills out upload form with time series data file attached
2. Get formatted date of data (YYYY-MM) to use as the key later
3. Convert data file to buffer
4. Send buffered file to IPFS via Infura
5. IPFS returns hash identifying the uploaded file
6. Add pin to returned hash so it does not get garbage collected
7. Get user's Ethereum address from MetaMask
8. Save user address, formatted date, and IPFS hash to dPanc Ethereum contract

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
contract dPanc {
  // TODO: events

  mapping(address => UserDataStore) public addressToUserDataStore;

  /// @param _date Formatted month date (YYYY-MM) of user's uploaded data
  /// @param _hash IPFS hash of data corresponding to _date
  function saveFileHash(string _date, string _hash) public {
    addressToUserDataStore[msg.sender].saveFileHash(_date, _hash);
  }
}

contract UserDataStore {
  // TODO: events

  struct FileMetadata {
      string hash;
      bool exists;
  }

  mapping(string => FileMetadata) dateToHash;  // maps date (YYYY-MM) to FileMetadata struct containing hash and exists bool
  string[] public datesByMonthList;   // holds all dates that user has uploaded data to allow entire history retrieval

  /// @param _date Formatted month date (YYYY-MM) of user's uploaded data
  /// @param _hash IPFS hash of data corresponding to _date
  function saveFileHash(string _date, string _hash) public {
    // Add date to datesByMonthList if first time seeing given date
    if (!dateToHash[_date].exists) {
      datesByMonthList.push(_date);
      dateToHash[_date].exists = true;
    }

    dateToHash[_date].hash = _hash;
  }

  /// @param _date Formatted month date (YYYY-MM) of user's uploaded data
  /// @return hash IPFS hash of data corresponding to _date
  function getFileHash(string _date) public view returns (string hash) {
      return dateToHash[_date].hash;
  }
}
```

### Data Retrieval

#### Retrieving Entire History of a User

**"date" for MVP refers to a month (YYYY-MM) since we require a whole month's data to be uploaded at once**

To retrieve the entire history of a user, we can do a lookup by the user's Ethereum address to get the user's `UserDataStore` object.

Then we can get all the dates that the user has uploaded data in the `datesByMonthList` list.

For each date in the `datesByMonthList`, we can call `getFileHash` with the date to get that date's IPFS hash.

Finally, we query IPFS with the hash to retrieve the data points.

### Global Data Store (TBD)
This one's tough...

The fundamental challenge is figuring out how and when to upload user data to the big data store while minimizing data duplication and keeping retrieval straightforward.

Ideally a data file in the big data store would contain data points from multiple people.

The current design allows users to re-upload and overwrite a month's dataset. This is simple to implement in the user data store by using a mapping of month date to IPFS hash, but difficult to implement in the big data store.

If we want to keep this feature of allowing users to re-upload a month's data (a BIG "if"), then we would need to implement some form of punishment such as exponentially increasing cost when re-uploading to prevent bad actors from uploading bad data.

If users cannot re-upload a month's data, then there is no issue and we do not need to do anything special in the big data store to handle duplicates.

<br>

### Post-MVP: Use IPNS ?

IPNS enhances IPFS by providing the ability to modify/write to a single constant key repeatedly. The fundamental barrier with IPFS is that the key (IPFS hash) is a hash of the value itself so changing the value will result in a different key (IPFS hash). This makes it difficult to update existing data as you need to keep track of a new key after every change.

With IPNS, we do not need to constantly keep track of a new key after every change to the value as IPNS handles it for us. IPNS exhibits functionality similar to if we were writing to a key/value database or using DNS (domain name service).

IPNS allows us to implement data storage as if we were using a database.

*User Metadata Document*
Each user will be assigned an unique IPNS name that maps to a JSON document containing the metadata for the user. This document will include some basic information about the user such a what year they were born, where they are from, etc. More importantly, this document will contain a list of IPFS hashes `dataHashes` where each hash maps to an entire month's worth of the user's data.

To retrieve a user's entire history, you would have to first retrieve the user's metadata document by IPNS hash, and then fetch the data from each IPFS hash in the `dataHashes` list.

*Global Big Data Metadata Document*
