const path = require('path')
const appRoot = require('app-root-path')
const client = require(appRoot + '/utils/initClient.js')
const base64ToImage = require('base64-to-image')
const fs = require('fs')
const lang = process.env.LOCALE

exports.createAsset = (req, res, next) => {
  const url = req.body.file.url
  const contentType = req.body.file.contentType
  const title = req.body.title
  const fileName = req.body.file.fileName  
  const entryId = req.query.entryId
  const isPublishable = req.query.publishable === 'true' ? true : false
  const base = base64ToImage(url, appRoot + '/public/uploads/')
  const fullPath = path.resolve(appRoot + '/public/uploads/' + base.fileName)

  client.initClient(req, res)
    .then(space => {
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
        return asset.update()
      })
      .then(published => {
        const title = published.fields.title[lang]
        const url = published.fields.file[lang].url
        const fileName = published.fields.file[lang].fileName
        const contentType = published.fields.file[lang].contentType

        published.delete() // Deletes uploaded image as a copy of it has already been made. We dont want 2 of the same image

        return space.getAsset(entryId)
          .then(asset => {
            asset.fields.title[lang] = title
            asset.fields.file[lang].url = url
            asset.fields.file[lang].fileName = fileName
            asset.fields.file[lang].contentType = contentType

            if (isPublishable) {
              return asset.publish()
            }
            return asset.update()
          })
          .then(entry => {
            return res.status(200).json({
              data: {
                metadata: {
                  version: entry.sys.version,
                  publishedVersion: entry.sys.publishedVersion,
                  updatedAt: entry.sys.updatedAt,
                  id: entry.sys.id
                }
              }
            })
          })
      })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    })
}