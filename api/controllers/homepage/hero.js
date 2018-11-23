const contentfulManagement = require('contentful-management')

const lang = 'en-GB'

const publishHandler = (data, publish) => {
  if (publish) {
    return data.publish()
  }
  return data.update()
}

const allPromises = (environment) => {
  const promise = Promise.all([
    environment.getEntry('3qDt3aaDQQMqAu8yg6C4gq'),  // Hero
    environment.getAsset('3UV3zH6fXq06mSMIKEMgcG'),  // Hero Image
    environment.getAsset('2Do8VFgtjuUGEu8uCyw6Oq')   // Hero Image Mobile
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
      const [main, heroImage, heroImageMobile] = entry

      console.log('entry', heroImage);

      return res.status(200).json({
        data: {
          metadata: {
            version: main.sys.version,
            publishedVersion: main.sys.publishedVersion,
            updatedAt: main.sys.updatedAt
          },
          fields: {
            title: main.fields.title[lang],
            subtitle: main.fields.subtitle[lang],
            image: {
              title: heroImage.fields.title[lang],
              file: {
                url: heroImage.fields.file[lang].url,
                fileName: heroImage.fields.file[lang].fileName,
                contentType: heroImage.fields.file[lang].contentType
              }
            },
            imageMobile: {
              title: heroImageMobile.fields.title[lang],
              file: {
                url: heroImageMobile.fields.file[lang].url,
                fileName: heroImageMobile.fields.file[lang].fileName,
                contentType: heroImageMobile.fields.file[lang].contentType
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
      return environment.getEntry('3qDt3aaDQQMqAu8yg6C4gq')
    })
    .then(entry => {
      // Homepage
      entry.fields.title[lang] = req.body.title

      return publishHandler(entry, isPublishable)
    })
    .then(updated => {
      return res.status(200).json({
        metadata: {
          version: updated.sys.version,
          publishedVersion: updated.sys.publishedVersion,
          updatedAt: updated.sys.updatedAt
        },
        message: 'Your work has been saved'
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};
