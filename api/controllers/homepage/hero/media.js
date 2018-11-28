const contentfulManagement = require('contentful-management')

const lang = 'en-GB'

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

const allPromises = (environment) => {
  const promise = Promise.all([
    environment.getAsset('pEJywsuGxam0K8kqmsKa0')  // Hero Image
  ])
  return promise
}

exports.fetchData = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ error: 'Need authorization header' });
  }

  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })

  client.getSpace('8vncqxfpqkp5')
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment)
    })
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

exports.updateData = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ error: 'Need authorization header' });
  }

  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })
  const isPublishable = req.query.publishable === 'true' ? true : false

  client.getSpace('8vncqxfpqkp5')
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment)
    })
    .then(entry => {
      const [main, heroImage, heroImageMobile] = entry

      main.fields.title[lang] = req.body.title
      main.fields.subtitle[lang] = req.body.subtitle
      heroImage.fields.title[lang] = req.body.image.title
      heroImage.fields.file[lang].upload = req.body.image.file.url
      heroImage.fields.file[lang].fileName = req.body.image.file.fileName
      heroImage.fields.file[lang].contentType = req.body.image.file.contentType

      return publishHandler([main, heroImage], isPublishable)
    })
    .then(updated => {
      const [main] = updated
      return res.status(200).json({
        metadata: {
          version: main.sys.version,
          publishedVersion: main.sys.publishedVersion,
          updatedAt: main.sys.updatedAt
        },
        message: 'Your work has been saved'
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};
