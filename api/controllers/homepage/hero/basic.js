const appRoot = require('app-root-path')
const library = require(appRoot + '/utils/library.js')
const lang = process.env.LOCALE
const entryId = '3qDt3aaDQQMqAu8yg6C4gq' // Hero Basic

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
            subtitle: main.fields.subtitle[lang]
          }
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};

exports.updateData = (req, res, next) => {
  const isPublishable = req.query.publishable === 'true' ? true : false

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
