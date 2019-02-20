exports.fetchData = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const userId = req.params.userId;
  const lang = process.env.LOCALE

  console.log(userId)

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return environment.getEntries({
        'content_type': 'user',
        'fields.userId': userId,
        'include': 2
      })
    })
    .then(entry => {
      const item = entry.items[0]

      console.log(entry.items[0].fields)

      res.status(200).json({
        about: item.fields.about[lang],
        image: {
          id: item.fields.image[lang].sys.id,
          linkType: item.fields.image[lang].sys.linkType
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};