exports.deletePage = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const entryId = req.query.entryId
  const isAsset = req.query.asset === 'true' ? true : false

  client.initClient(req, res)
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return environment.getEntry(entryId)
        .then(entry => {
          // We now have the page, lets get Child entries
          const fields = entry.fields
          const promises = [entry]

          Object.keys(fields).forEach((key) => {
            if (fields[key]['en-GB'].sys) {
              promises.push(environment.getEntry(fields[key]['en-GB'].sys.id))
            }
          })

          return Promise.all(promises)
        })
        .then(entries => {
          // Now lets get Grand Child entries
          const promises = entries

          entries.map(entry => {
            const fields = entry.fields

            Object.keys(fields).forEach((key) => {
              if (fields[key]['en-GB'].sys) {
                if (fields[key]['en-GB'].sys.linkType === 'Asset') {
                  promises.push(environment.getAsset(fields[key]['en-GB'].sys.id))
                } else {
                  promises.push(environment.getEntry(fields[key]['en-GB'].sys.id))
                }
              } 
            })
          })

          return Promise.all(promises)
        })
        .then(allEntries => {
          // Lets unpublish ALL entries of Page
          return allEntries.map(entry => {
            const publishedVersion = entry.sys.publishedVersion
            const version = entry.sys.version
            // lets see if its published
            if (publishedVersion && ((publishedVersion + 1) >= version)) {
              // Now unpublish it
              return entry.unpublish()
            }
            return entry
          })
        })
        .then(() => {
          return entry.delete()
        })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
