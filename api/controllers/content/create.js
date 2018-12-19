exports.createData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const path = require('path')
  const client = require(appRoot + '/utils/initClient.js')
  const lang = process.env.LOCALE
  const url = req.body.hero.image.file.url
  const fileName = req.body.hero.image.file.fileName
  const base64ToImage = require('base64-to-image')
  const base = base64ToImage(url, appRoot + '/public/uploads/')
  const fullPath = path.resolve(appRoot + '/public/uploads/' + base.fileName)
  const fs = require('fs')

  console.log('url', url);
  console.log('fileName', fileName);

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
      .then(environment => {
        // Create pageMeta first
        return environment.createEntry('pageMeta', {
          fields: {
            title: {
              [lang]: req.body.pageMeta.title
            },
            description: {
              [lang]: req.body.pageMeta.description
            }
          }
        })
        .then(pageMeta => {
          return environment.createEntry('button', {
            fields: {
              title: {
                [lang]: req.body.hero.cta.title
              },
              path: {
                [lang]: req.body.hero.cta.path
              }
            }
          })
          .then(button => {
            return space.createUpload({
              file: fs.readFileSync(fullPath)
            })
            .then(upload => {
              return environment.createAsset({
                fields: {
                  title: {
                    [lang]: req.body.hero.image.alt
                  },
                  file: {
                    [lang]: {
                      contentType: req.body.hero.image.file.contentType,
                      fileName: req.body.hero.image.file.fileName,
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
                  return asset.update()
                })
                .then(() => {
                  console.log('create hero button', button.sys.id);
                  console.log('create hero image', asset.sys.id);
                  return environment.createEntry('hero', {
                    fields: {
                      title: {
                        [lang]: req.body.hero.title
                      },
                      subtitle: {
                        [lang]: req.body.hero.subtitle
                      },
                      cta: {
                        [lang]: {
                          sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: button.sys.id
                          }
                        }
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
                  .then(hero => {
                    // Now add the rest of the page
                    return environment.createEntry('pages', {
                      fields: {
                        title: {
                          [lang]: req.body.title
                        },
                        subtitle: {
                          [lang]: req.body.subtitle
                        },
                        slug: {
                          [lang]: req.body.slug
                        },
                        mainNavigation: {
                          [lang]: req.body.navigation
                        },
                        description: {
                          [lang]: req.body.description
                        },
                        order: {
                          [lang]: req.body.order
                        },
                        pageMeta: {
                          [lang]: {
                            sys: {
                              type: 'Link',
                              linkType: 'Entry',
                              id: pageMeta.sys.id
                            }
                          }
                        },
                        hero: {
                          [lang]: {
                            sys: {
                              type: 'Link',
                              linkType: 'Entry',
                              id: hero.sys.id
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
      })
    })
    .then(created => {
      console.log('created', created.fields);
      return res.status(200).json({
        metadata: {
          version: created.sys.version,
          publishedVersion: created.sys.publishedVersion,
          updatedAt: created.sys.updatedAt
        },
        message: 'This page has been created'
      })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    })
}
