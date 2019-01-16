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
      // return getAllEntryIds(environment, entryId)
      //   .then(ids => {
      //     return getEntries(ids, environment)
      //       .then(entries => {
      //         // Now get Child Entries
      //         console.log('MOUSE', entries);
      //         return getChildEntries(entries, environment)
      //       })
      //   })
      //   .then(id => {
      //     // Now unpublish page
      //     return unpublishEntry(id)
      //   })
      //   .then(entry => {
      //     // Now delete page
      //     return entry.delete()
      //   })
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
        // console.log('PROMISES', promises);

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
        allEntries.map(entry => {
          return entry.unpublish()
            .then(() => {
              return entry.delete()
            })
        })
      })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
