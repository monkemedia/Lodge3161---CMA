const appRoot = require('app-root-path')
const client = require(appRoot + '/utils/initClient.js')
const library = require(appRoot + '/utils/library.js')
const lang = process.env.LOCALE

const allPromises = (environment) => {
  const promise = Promise.all([
    environment.getEntry('75BP94mOSAqkOYOw8Mqcuy')  // Content Block Top Button
  ])
  return promise
}

exports.fetchData = (req, res, next) => {
  client.initClient(req, res)
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
            path: main.fields.path[lang]
          }
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};

exports.updateData = (req, res, next) => {
  const isPublishable = req.query.publishable === 'true' ? true : false

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment)
    })
    .then(entry => {
      const [main] = entry

      main.fields.title[lang] = req.body.title
      main.fields.description[lang] = req.body.description

      return library.publishHandler([main], isPublishable)
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
