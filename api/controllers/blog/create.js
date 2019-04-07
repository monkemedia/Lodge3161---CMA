exports.createData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const path = require('path')
  const client = require(appRoot + '/utils/initClient.js')
  const lang = process.env.LOCALE
  const url = req.body.media.file[lang].url
  const fileName = req.body.media.file[lang].fileName
  const base64ToImage = require('base64-to-image')
  const base = base64ToImage(url, appRoot + '/public/uploads/')
  const fullPath = path.resolve(appRoot + '/public/uploads/' + base.fileName)
  const fs = require('fs')

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
        .then(environment => {
          return space.createUpload({
            file: fs.readFileSync(fullPath)
          })
          .then(upload => {
            return environment.createAsset({
              fields: {
                title: {
                  [lang]: req.body.media.title
                },
                file: {
                  [lang]: {
                    contentType: req.body.media.file[lang].contentType,
                    fileName: req.body.media.file[lang].fileName,
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
            .then(asset => {
              return asset.processForAllLocales()
                .then(asset => {
                  return asset.publish()
                    .then(() => {
                      return environment.createEntry('blog', {
                        fields: {
                          title: {
                            [lang]: req.body.title
                          },
                          description: {
                            [lang]: req.body.fields.description
                          },
                          image: {
                            [lang]: {
                              sys: {
                                type: 'Link',
                                linkType: 'Asset',
                                id: asset.sys.id
                              }
                            }
                          }
                        }
                      })
                    })
                })
            })
          })
        })
    })
    .then(created => {
      return res.status(200).json({
        metadata: {
          version: created.sys.version,
          publishedVersion: created.sys.publishedVersion,
          updatedAt: created.sys.updatedAt
        },
        message: 'This post has been created',
        data: {
          title: created.fields.title[lang],
          id: created.sys.id
        }
      })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    })
}
