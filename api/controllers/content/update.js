exports.updateData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const lang = process.env.LOCALE
  const entryId = req.query.entryId
  const isPublishable = req.query.publishable === 'true' ? true : false

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return environment.getEntry(entryId)
    })
    .then(entry => {
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] === null) { return } // Stops submitting data if equal to null
        entry.fields[key][lang] = req.body[key]
      });

      if (isPublishable) {
        return entry.publish()
      }
      return entry.update()
    })
    .then(updated => {
      return res.status(200).json({
        metadata: {
          version: updated.sys.version,
          publishedVersion: updated.sys.publishedVersion,
          updatedAt: updated.sys.updatedAt
        },
        message: 'Your work has been saved'
      })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    })
}
