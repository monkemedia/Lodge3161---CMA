exports.fetchData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const entryId = req.query.entryId
  const contentType = req.query.contentType

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return environment.getEntries({
        content_type: contentType,
        order: '-sys.createdAt'
      })
    })
    .then(entry => {
      const items = entry.items.map(it => {
        const id = it.sys.id
        return {
          path: `/blog/posts/${id}`,
          title: it.fields.title['en-GB'],
          id
        }
      })

      return res.status(200).json(items);
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
