const contentfulManagement = require('contentful-management')

const lang = 'en-GB'

const publishHandler = (data, publish) => {
  if (publish) {
    return data.publish()
  }
  return data.update()
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
      return environment.getEntry('7tT62M3wjYWqGMqOyAEoC2')
    })
    .then(entry => {
      return res.status(200).json({
        data: {
          metadata: {
            version: entry.sys.version,
            publishedVersion: entry.sys.publishedVersion,
            updatedAt: entry.sys.updatedAt
          },
          fields: {
            title: entry.fields.title[lang],
            slug: entry.fields.slug[lang],
            description: entry.fields.description[lang],
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
      return environment.getEntry('7tT62M3wjYWqGMqOyAEoC2')
    })
    .then(entry => {
      // Homepage
      entry.fields.title[lang] = req.body.title
      entry.fields.description[lang] = req.body.description

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
