const contentfulManagement = require('contentful-management')
const fs = require('fs')
const lang = 'en-GB'
const base64ToImage = require('base64-to-image')
const path = require('path')

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

  const base = base64ToImage(url, './public/uploads/')
  const fullPath = path.resolve(__dirname, '../../../public/uploads/' + base.fileName)

  client.getSpace('8vncqxfpqkp5')
    .then(space => {
      return space.createUpload({
        file: fs.readFileSync(fullPath)
      })
      .then(upload => {
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
        console.log('prcessing...');
        return asset.processForLocale(lang, { processingCheckWait: 2000 });
      })
      .then(asset => {
        console.log('ASSET BABY', asset);
        return asset.publish()
      })
    })
    .catch(err => {
      console.log('err', err);
      return res.status(500).json({ error: err.message });
    })
}