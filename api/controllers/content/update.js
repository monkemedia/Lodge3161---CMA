exports.updateData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const lang = process.env.LOCALE
  const entryId = req.query.entryId
  const isPublishable = req.query.publishable === 'true'
  const isUpdateAndPublish = req.query.isUpdateAndPublish === 'true'

  console.log('req.body', req.body)

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return environment.getEntry(entryId)
    })
    .then(entry => {
      Object.keys(req.body.fields).forEach((key) => {
        if (entry.fields[key] === undefined || req.body[key] === null) return

        entry.fields[key][lang] = req.body.fields[key]
      })

      if (isPublishable) {
        return entry.publish()
      } else if (isUpdateAndPublish) {
        return entry.update()
          .then(updatedEntry => {
            return updatedEntry.publish()
          })
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
