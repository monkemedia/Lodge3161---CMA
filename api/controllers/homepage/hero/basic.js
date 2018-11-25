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
      console.log('res', res);
      return res
    })
}

const allPromises = (environment) => {
  const promise = Promise.all([
    environment.getEntry('3qDt3aaDQQMqAu8yg6C4gq')  // Hero
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
      const [main] = entry

      return res.status(200).json({
        data: {
          metadata: {
            version: main.sys.version,
            publishedVersion: main.sys.publishedVersion,
            updatedAt: main.sys.updatedAt
          },
          fields: {
            title: main.fields.title[lang],
            subtitle: main.fields.subtitle[lang]
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
      const [main] = entry

      main.fields.title[lang] = req.body.title
      main.fields.subtitle[lang] = req.body.subtitle

      return publishHandler([main], isPublishable)
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
