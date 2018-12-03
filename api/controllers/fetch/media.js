exports.fetchData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const library = require(appRoot + '/utils/library.js')
  const lang = process.env.LOCALE

  library.fetchData(req, res, true)
    .then(entry => {
      const [media] = entry

      console.log('media', media)

      return res.status(200).json({
        data: {
          metadata: {
            version: media.sys.version,
            publishedVersion: media.sys.publishedVersion,
            updatedAt: media.sys.updatedAt,
            id: media.sys.id
          },
          fields: {
            title: media.fields.title[lang],
            image: {
              file: {
                url: media.fields.file[lang].url,
                fileName: media.fields.file[lang].fileName,
                contentType: media.fields.file[lang].contentType
              }
            }
          }
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};
