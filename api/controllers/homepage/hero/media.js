const appRoot = require('app-root-path')
const library = require(appRoot + '/utils/library.js')
const lang = process.env.LOCALE
const entryId = 'pEJywsuGxam0K8kqmsKa0' // Hero Media

exports.fetchData = (req, res, next) => {
  library.fetchAssetData(req, res, entryId)
    .then(entry => {
      const [heroImage] = entry

      return res.status(200).json({
        data: {
          metadata: {
            version: heroImage.sys.version,
            publishedVersion: heroImage.sys.publishedVersion,
            updatedAt: heroImage.sys.updatedAt,
            id: heroImage.sys.id
          },
          fields: {
            title: heroImage.fields.title[lang],
            image: {
              file: {
                url: heroImage.fields.file[lang].url,
                fileName: heroImage.fields.file[lang].fileName,
                contentType: heroImage.fields.file[lang].contentType
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
