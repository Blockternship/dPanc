const IPFS = require('ipfs-api');
const OrbitDB = require('orbit-db')
const ipfs = new IPFS('ipfs.infura.io', '5001', {protocol: 'https'})
const orbitdb = new OrbitDB(ipfs)

/**
* Creates an OrbitDB database given the database name.
*
* TODO after MVP:
*    - Permissioned dbs so only user can write
*    - Enable OrbitDB replication (Infura does not support IPFS pubsub so we have to disable it)
*    - Set 'overwrite' to false
*/
exports.createDb = async function(req, res) {
  const { dbName } = req.body;
  console.log(req.body);

  try {
    const db = await orbitdb.create(dbName, 'keyvalue', {
      write: ['*'],
      replicate: false,
      overwrite: true
    });

    const dbAddress = db.address.toString();

    await db.close();

    res.send(dbAddress);
  } catch (err) {
    console.log(err);
    res.status(400).end();
  }
};

/**
* Uploads the data to the requested OrbitDB database.
*/
exports.uploadToDb = async function(req, res) {
  const { dbAddress, key, data } = req.body;
  console.log(req.body);

  try {
    const db = await orbitdb.open(dbAddress, {
      replicate: false
    });

    console.log(`Loading db ${dbAddress}...`);
    await db.load();
    console.log(`Db ${dbAddress} loaded successfully!`);

    // Now put data
    console.log(`Putting data at key=${key}...`);
    await db.put(key, data);
    console.log(`Sucessfully put data!`);

    console.log(`Closing db ${dbAddress}...`);
    await db.close();
    console.log(`Successfully closed db ${dbAddress}`);

    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(400).end();
  }
};

/**
* Retrieves a data set from the specified OrbitDB database.
*/
exports.getData = async function(req, res) {
  const { dbAddress, key } = req.body;

  const db = await orbitdb.open(dbAddress, {
    replicate: false
  });

  console.log(`Loading db ${dbAddress}...`);
  await db.load();
  console.log(`Db ${dbAddress} loaded successfully!`);

  console.log(`Fetching data at key=${key}...`);

  // Now get key
  const value = db.get(key);

  console.log(value);

  res.send(value);
};

exports.getDataByKeys = async function(req, res) {
  try {
    const { dbAddress, keys } = req.body;

    const db = await orbitdb.open(dbAddress, {
      replicate: false
    });

    console.log(`Loading db ${dbAddress}...`);
    await db.load();
    console.log(`Db ${dbAddress} loaded successfully!`);

    const data = {};
    for (var key of keys) {
      console.log(`Fetching data at key=${key}...`);
      const value = db.get(key);

      if (value) {
        data.glucose = data.glucose ? [...data.glucose, ...value.glucose] : value.glucose;
      }
    }

    console.log(data);

    res.send(data);
  } catch (err) {
    res.send({
      error: err.message
    });
  }
}
