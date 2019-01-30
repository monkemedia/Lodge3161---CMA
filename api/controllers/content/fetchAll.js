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
      function sublinks (fields) {
        const newArray = []

        Object.keys(fields).forEach((key) => {
          if (Array.isArray(fields[key]['en-GB'])) {
            for (let i = 0; i < fields[key]['en-GB'].length; i++) {
              newArray.push({
                title: `${key} ${i + 1}`,
                id: fields[key]['en-GB'][i].sys.id,
                path: `/templates/${fields.slug['en-GB']}`,
              })
            }
          } else if (fields[key]['en-GB'].sys) {
            newArray.push({
              title: key,
              id: fields[key]['en-GB'].sys.id,
              path: `/templates/${fields.slug['en-GB']}`,
            })
          }
        })

        return newArray
      }

      const items = entry.items.map(it => {
        return {
          title: it.fields.title['en-GB'],
          path: `/templates/${it.fields.slug['en-GB']}`,
          name: it.fields.slug['en-GB'],
          id: it.sys.id,
          subLinks: sublinks(it.fields),
          isDraggable: it.fields.slug['en-GB'] !== 'homepage' ? true : false,
          isParent: true
        }
      })

      return res.status(200).json({
        data: items
      });
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
