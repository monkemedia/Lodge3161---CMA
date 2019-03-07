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
        content_type: contentType
      })
    })
    .then(entry => {
      function children (fields) {
        const newArray = []

        Object.keys(fields).forEach((key) => {
          if (Array.isArray(fields[key]['en-GB'])) {
            for (let i = 0; i < fields[key]['en-GB'].length; i++) {
              newArray.push({
                name: `${key} ${i + 1}`,
                id: fields[key]['en-GB'][i].sys.id,
                path: `/templates/${fields.slug['en-GB']}`,
              })
            }
          } else if (fields[key]['en-GB'].sys) {
            newArray.push({
              name: key,
              id: fields[key]['en-GB'].sys.id,
              path: `/templates/${fields.slug['en-GB']}`
            })
          }
        })

        return newArray
      }

      const items = entry.items.map(it => {
        return {
          path: `/templates/${it.fields.slug['en-GB']}`,
          name: it.fields.slug['en-GB'],
          id: it.sys.id,
          children: children(it.fields),
          isActive: false
        }
      })

      return res.status(200).json(items);
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
