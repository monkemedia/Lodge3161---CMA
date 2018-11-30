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
  libray.updateData(req, res, entryId)
};
