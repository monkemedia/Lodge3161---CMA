exports.updateData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const library = require(appRoot + '/utils/library.js')
  const lang = process.env.LOCALE
  const isPublishable = req.query.publishable === 'true' ? true : false
  const entryId = req.query.entryId

  library.updateData(req, res, entryId)
    .then(entry => {
      const [main] = entry

      main.fields.title[lang] = req.body.title
      main.fields.subtitle[lang] = req.body.subtitle

      return library.publishHandler([main], isPublishable)
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
      })
    })
    .catch(err => {
      res.status(500).send({ error: err });
    })
}
