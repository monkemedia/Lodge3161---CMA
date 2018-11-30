const appRoot = require('app-root-path')
const library = require(appRoot + '/utils/library.js')
const lang = process.env.LOCALE
const entryId = '7tT62M3wjYWqGMqOyAEoC2' // Homepage main

exports.fetchData = (req, res, next) => {
  library.fetchData(req, res, entryId)
    .then(entry => {
      const [main] = entry

      return res.status(200).json({
        data: {
          metadata: {
            version: main.sys.version,
            publishedVersion: main.sys.publishedVersion,
            updatedAt: main.sys.updatedAt
          },
          fields: {
            title: main.fields.title[lang],
            slug: main.fields.slug[lang],
            description: main.fields.description[lang]
          }
        }
      })
    })
    .catch(err => {
      res.status(500).send({ error: err });
    })
}

exports.updateData = (req, res, next) => {
  const isPublishable = req.query.publishable === 'true' ? true : false

  library.updateData(req, res, entryId)
    .then(entry => {
      const [main] = entry

      main.fields.title[lang] = req.body.title
      main.fields.description[lang] = req.body.description

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
