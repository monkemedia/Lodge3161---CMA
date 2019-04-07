const appRoot = require('app-root-path')
const client = require(appRoot + '/utils/initClient.js')
const lang = process.env.LOCALE

exports.fetchData = (req, res, next) => {
  const entryId = req.query.entryId
  const isAsset = req.query.asset === 'true'

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      if (entryId !== 'null') {
        if (isAsset) {
          return environment.getAsset(entryId)
        }
        return environment.getEntry(entryId)
      }

      throw {
        status: 204,
        message: 'Content cannot be found.'
      }
    })
    .then(entry => {
      return res.status(200).json({
        metadata: {
          version: entry.sys.version,
          publishedVersion: entry.sys.publishedVersion,
          updatedAt: entry.sys.updatedAt,
          id: entry.sys.id,
          type: entry.sys.contentType ? entry.sys.contentType.sys.id : null
        },
        fields: entry.fields
      })
    })
    .catch(err => {
      console.log("err", err);
      res.status(err.status).send({ error: err })
    });
};
