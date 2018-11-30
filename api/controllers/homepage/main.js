const appRoot = require('app-root-path')
const client = require(appRoot + '/utils/initClient.js')
const library = require(appRoot + '/utils/library.js')
const lang = process.env.LOCALE

exports.fetchData = (req, res, next) => {
  client.initClient(req, res)
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
  const isPublishable = req.query.publishable === 'true' ? true : false

  client.initClient(req, res)
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

      return library.publishHandler([entry], isPublishable)
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
