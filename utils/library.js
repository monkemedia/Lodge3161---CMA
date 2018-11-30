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

const publishHandler = (data, publish) => {
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
  const isPublishable = req.query.publishable === 'true' ? true : false

  return client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment, entryId)
    })
    .then(entry => {
      const [main] = entry

      main.fields.title[lang] = req.body.title
      main.fields.subtitle[lang] = req.body.subtitle

      return publishHandler([main], isPublishable)
    })
    .then(updated => {
      const [main] = updated

      return res.status(200).json({
        metadata: {
          version: main.sys.version,
          publishedVersion: main.sys.publishedVersion,
          updatedAt: main.sys.updatedAt
        },
        message: 'Your work has been saved'
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};
