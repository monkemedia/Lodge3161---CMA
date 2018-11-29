const path = require('path')
const appRoot = require('app-root-path')
const client = require(appRoot + '/utils/initClient.js')
const library = require(appRoot + '/utils/library.js')
const base64ToImage = require('base64-to-image')
const fs = require('fs')
const lang = process.env.LOCALE

exports.createAsset = (req, res, next) => {
  const url = req.body.file.url
  const contentType = req.body.file.contentType
  const title = req.body.title
  const fileName = req.body.file.fileName  
  const oldAssetId = req.query.oldAssetId
  const isPublishable = req.query.publishable === 'true' ? true : false
  const base = base64ToImage(url, appRoot + '/public/uploads/')
  const fullPath = path.resolve(__dirname, '../../../public/uploads/' + base.fileName)

  client.initClient(req, res)
    .then(space => {
      console.log('space');
      return space.createUpload({
        file: fs.readFileSync(fullPath)
      })
      .then(upload => {
        // CREATES ASSET ON upload.contentful.com
        return space.createAsset({
          fields: {
            title: {
              [lang]: title
            },
            file: {
              [lang]: {
                fileName: fileName,
                contentType: contentType,
                uploadFrom: {
                  sys: {
                    type: 'Link',
                    linkType: 'Upload',
                    id: upload.sys.id
                  }
                }
              }
            }
          }
        })
      })
      .then(asset => {
        return asset.processForLocale(lang, { processingCheckWait: 2000 });
      })
      .then(asset => {
        return library.publishHandler([asset], isPublishable)
      })
      .then(published => {
        const [image] = published
        const title = image.fields.title[lang]
        const url = image.fields.file[lang].url
        const fileName = image.fields.file[lang].fileName
        const contentType = image.fields.file[lang].contentType

        image.delete() // Deletes uploaded image as a copy of it has already been made. We dont want 2 of the same image

        return space.getAsset(oldAssetId)
          .then(asset => {
            asset.fields.title[lang] = title
            asset.fields.file[lang].url = url
            asset.fields.file[lang].fileName = fileName
            asset.fields.file[lang].contentType = contentType

            return library.publishHandler([asset], isPublishable)
          })
          .then(entry => {
            const [image] = entry
            return res.status(200).json({
              data: {
                metadata: {
                  version: image.sys.version,
                  publishedVersion: image.sys.publishedVersion,
                  updatedAt: image.sys.updatedAt,
                  id: image.sys.id
                }
              }
            })
          })
      })
    })
    .catch(err => {
      console.log('err', err);
      return res.status(500).json({ error: err.message });
    })
}