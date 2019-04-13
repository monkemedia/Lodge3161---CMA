exports.deletePost = (req, res, next) => {
  const appRoot = require('app-root-path')
  const client = require(appRoot + '/utils/initClient.js')
  const entryId = req.query.entryId
  const isAsset = req.query.asset === 'true'

  console.log("HERE");

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
              if (fields[key]['en-GB'].sys.linkType === 'Asset') {
                promises.push(environment.getAsset(fields[key]['en-GB'].sys.id))
              } else {
                promises.push(environment.getEntry(fields[key]['en-GB'].sys.id))
              }
            }
          })

          return Promise.all(promises)
            .then(entries => {
              return entries.map(ent => {
                const fields = ent.fields

                console.log('fields', fields);

                // return Object.keys(fields).forEach((key) => {
                //   if (fields[key]['en-GB'].sys) {
                //     if (fields[key]['en-GB'].sys.linkType === 'Asset') {
                //       console.log("ASSET");
                //       // promises.push(environment.getAsset(fields[key]['en-GB'].sys.id))
                //       return environment.getAsset(fields[key]['en-GB'].sys.id)
                //         .then(asset => {
                //           return asset.unpublish()
                //         })
                //         .then(asset => {
                //           return asset.delete()
                //         })
                //     } else {
                //       // promises.push(environment.getEntry(fields[key]['en-GB'].sys.id))
                //       return environment.getEntry(fields[key]['en-GB'].sys.id)
                //         .then(en => {
                //           return en.unpublish()
                //         })
                //         .then(en => {
                //           return en.delete()
                //         })
                //     }
                //   } 
                // })
              })
            })
            .then(() => {
              const publishedVersion = entry.sys.publishedVersion
              const version = entry.sys.version

              if (publishedVersion && ((publishedVersion + 1) === version)) {
                return entry.unpublish()
              }
              return entry
            })
            .then(e => {
              return e.delete()
            })
        })
    })
    .then(() => {
      res.status(200).send({ message: 'Post deleted' })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
