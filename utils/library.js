const appRoot = require('app-root-path')
const client = require(appRoot + '/utils/initClient.js')

// exports.allPromises = (environment, entryId) => {
//   return promise = Promise.all([
//     environment.getEntry(entryId)
//   ])
// }

const allPromises = (environment, entryId) => {
  const promise = Promise.all([
    environment.getEntry(entryId)
  ])
  return promise
}

const allAssetPromises = (environment, entryId) => {
  const promise = Promise.all([
    environment.getAsset(entryId)
  ])
  return promise
}

exports.publishHandler = (data, publish) => {
  const promises = []

  data.forEach(d => {
    if (publish) {
      return promises.push(d.publish())
    }
    return promises.push(d.update())
  })

  return Promise.all(promises)
    .then(res => {
      return res
    })
}

exports.fetchData = (req, res, isMedia) => {
  console.log('isMedia', isMedia);
  const entryId = req.query.entryId
  return client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      if (!isMedia) {
        return allPromises(environment, entryId)
      }
      return allAssetPromises(environment, entryId)
    })
};

exports.fetchAssetData = (req, res, entryId) => {
  return client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allAssetPromises(environment, entryId)
    })
};

exports.updateData = (req, res, entryId) => {
  return client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment, entryId)
    })
};
