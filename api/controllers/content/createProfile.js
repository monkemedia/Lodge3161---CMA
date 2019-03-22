exports.createProfile = (req, res, next) => {
  const appRoot = require('app-root-path')
  const path = require('path')
  const client = require(appRoot + '/utils/initClient.js')
  const lang = process.env.LOCALE
  const url = req.body.media.file.url
  const fileName = req.body.media.file.fileName
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
                    contentType: req.body.media.file.contentType,
                    fileName: req.body.media.file.fileName,
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
            return asset.processForAllLocales()
              .then(asset => {
                return asset.publish()
                  .then(() => {
                    return environment.createEntry('user', {
                      fields: {
                        userId: {
                          [lang]: req.body.userId
                        },
                        firstName: {
                          [lang]: req.body.fields.firstName
                        },
                        lastName: {
                          [lang]: req.body.fields.lastName
                        },
                        about: {
                          [lang]: req.body.fields.about
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
    .then(entry => {
      return entry.publish()
    })
    .then(() => {
      return res.status(200).json({
        message: 'This page has been created',
      })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    })
}
