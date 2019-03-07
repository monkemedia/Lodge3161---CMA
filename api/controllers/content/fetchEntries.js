exports.fetchData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const entryId = req.query.entryId
  const params = req.query

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return environment.getEntries(params)
    })
    .then(entries => {
      const entry = entries.items[0]

      return res.status(200).json({
        metadata: {
          version: entry.sys.version,
          publishedVersion: entry.sys.publishedVersion,
          updatedAt: entry.sys.updatedAt,
          id: entry.sys.id,
          type: entry.sys.contentType ? entry.sys.contentType.sys.id : null
        },
        fields: entry.fields
      })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
