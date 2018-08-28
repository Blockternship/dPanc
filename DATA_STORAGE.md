## Data Storage

This document details how user data will be stored.

### IPFS (Inter-Planetary File System)

### Ethereum Contract to Onbboard and Store Metadata

User data is not stored directly on the Ethereum blockchain as it not suited for big data storage.

An Ethereum contract will be leveraged to onboard the user's data, and to store the IPFS hashes that map to the JSON document containing the user's data points.

#### Proposal 1 (Full Product): Use IPNS*

IPNS enhances IPFS by providing the ability to modify/write to a single constant key repeatedly. The fundamental barrier with IPFS is that the key (IPFS hash) is a hash of the value itself so changing the value will result in a different key (IPFS hash). This makes it difficult to update existing data as you need to keep track of a new key after every change.

With IPNS, we do not need to constantly keep track of a new key after every change to the value as IPNS handles it for us. IPNS exhibits functionality similar to if we were writing to a key/value database or using DNS (domain name service).

IPNS allows us to implement data storage as if we were using a database.

*User Metadata Document*
Each user will be assigned an unique IPNS name that maps to a JSON document containing the metadata for the user. This document will include some basic information about the user such a what year they were born, where they are from, etc. More importantly, this document will contain a list of IPFS hashes `dataHashes` where each hash maps to an entire month's worth of the user's data.

To retrieve a user's entire history, you would have to first retrieve the user's metadata document by IPNS hash, and then fetch the data from each IPFS hash in the `dataHashes` list.

*Global Big Data Metadata Document*


#### Proposal 2 (MVP): Store a user's IPFS data hashes in a mapping (address => struct)*

