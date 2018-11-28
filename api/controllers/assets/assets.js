const contentfulManagement = require('contentful-management')
const fs = require('fs')
const lang = 'en-GB'
const base64ToImage = require('base64-to-image')
const path = require('path')

const publishHandler = (data, publish) => {
  const promises = []

  data.forEach(d => {
    if (publish) {
      return promises.push(d.publish())
    }
    return promises.push(d.update())
  })

  return Promise.all(promises)
    .then(res => {
      return res
    })
}

exports.createAsset = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ error: 'Need authorization header' });
  }

  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })

  const url = req.body.file.url
  const contentType = req.body.file.contentType
  const fileName = req.body.file.fileName  
  const oldAssetId = req.query.oldAssetId
  const isPublishable = req.query.publishable === 'true' ? true : false

  const base = base64ToImage(url, './public/uploads/')
  const fullPath = path.resolve(__dirname, '../../../public/uploads/' + base.fileName)

  client.getSpace('8vncqxfpqkp5')
    .then(space => {
      return space.createUpload({
        file: fs.readFileSync(fullPath)
      })
      .then(upload => {
        // CREATES ASSET ON upload.contentful.com
        return space.createAsset({
          fields: {
            title: {
              [lang]: fileName
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
        return asset.publish()
      })
      .then(published => {
        const title = published.fields.file[lang].fileName
        const url = published.fields.file[lang].url
        const fileName = title
        const contentType = published.fields.file[lang].contentType

        return space.getAsset(oldAssetId)
          .then(asset => {
            asset.fields.title[lang] = title
            asset.fields.file[lang].url = url
            asset.fields.file[lang].fileName = fileName
            asset.fields.file[lang].contentType = contentType

            return publishHandler([asset], isPublishable)
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