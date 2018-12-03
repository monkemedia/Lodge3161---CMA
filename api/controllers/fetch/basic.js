exports.fetchData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const library = require(appRoot + '/utils/library.js')
  const lang = process.env.LOCALE

  library.fetchData(req, res, false)
    .then(entry => {
      const [basic] = entry

      return res.status(200).json({
        data: {
          metadata: {
            version: basic.sys.version,
            publishedVersion: basic.sys.publishedVersion,
            updatedAt: basic.sys.updatedAt
          },
          fields: {
            title: basic.fields.title[lang],
            subtitle: basic.fields.subtitle[lang]
          }
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};
