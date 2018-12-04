exports.fetchData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const entryId = req.query.entryId
  const isAsset = req.query.asset === 'true' ? true : false

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      if (isAsset) {
        return environment.getAsset(entryId)
      }
      return environment.getEntry(entryId)
    })
    .then(entry => {
      return res.status(200).json({
        data: {
          metadata: {
            version: entry.sys.version,
            publishedVersion: entry.sys.publishedVersion,
            updatedAt: entry.sys.updatedAt,
            id: entry.sys.id
          },
          fields: entry.fields
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
