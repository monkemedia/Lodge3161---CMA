exports.fetchData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const library = require(appRoot + '/utils/library.js')
  const lang = process.env.LOCALE

  library.fetchData(req, res, false)
    .then(entry => {
      const [button] = entry

      return res.status(200).json({
        data: {
          metadata: {
            version: button.sys.version,
            publishedVersion: button.sys.publishedVersion,
            updatedAt: button.sys.updatedAt
          },
          fields: {
            title: button.fields.title[lang],
            path: button.fields.path[lang]
          }
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};
