const appRoot = require('app-root-path')
const client = require(appRoot + '/utils/initClient.js')

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

exports.fetchData = (req, res, entryId) => {
  return client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment, entryId)
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
