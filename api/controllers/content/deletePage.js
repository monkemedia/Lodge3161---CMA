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
            .then(entries => {
              // Now lets get Grand Child entries
              // const promises = entries

              return entries.map(ent => {
                const fields = ent.fields

                return Object.keys(fields).forEach((key) => {
                  if (fields[key]['en-GB'].sys) {
                    if (fields[key]['en-GB'].sys.linkType === 'Asset') {
                      // promises.push(environment.getAsset(fields[key]['en-GB'].sys.id))
                      return environment.getAsset(fields[key]['en-GB'].sys.id)
                        .then(asset => {
                          return asset.unpublish()
                        })
                        .then(asset => {
                          return asset.delete()
                        })
                    } else {
                      // promises.push(environment.getEntry(fields[key]['en-GB'].sys.id))
                      return environment.getEntry(fields[key]['en-GB'].sys.id)
                        .then(en => {
                          return en.unpublish()
                        })
                        .then(en => {
                          return en.delete()
                        })
                    }
                  } 
                })
              })

              // return Promise.all(promises)
            })
            .then(() => {
              return entry.unpublish()
            })
            .then(e => {
              return e.delete()
            })
        })
        // .then(entries => {
        //   // Move parent page to end of array so it gets deleted last
        //   const pagesIndex = entries.findIndex(entry => {
        //     return entry.sys.contentType.sys.id === 'pages'
        //   })

        //   entries.push(entries.splice(pagesIndex, 1)[0]);

        //   return entries
        // })
        // .then(entries => {
        //   // Unpublish and delete assets first
        //   const promises = []
        //   console.log("check for assets");

        //   entries.map(entry => {

        //     if (entry.sys.type === 'Asset') {
        //       promises.push(entry.unpublish().then(() => entry.delete()))
        //     } else {
        //       promises.push(entry)
        //     }
        //   })

        //   console.log('PROMISES', promises);

        //   return Promise.all(promises)
        // })
        // .then(allEntries => {
        //   console.log("ALL ENTRIES", allEntries);
        //   const promises = []
        //   // Lets unpublish ALL entries of Page
        //   allEntries.map(entry => {
        //     const publishedVersion = entry.sys.publishedVersion
        //     const version = entry.sys.version
        //     // lets see if its published
        //     // console.log("ID", entry.sys.id, 'Type: ', entry.sys.type);
        //     // console.log('published version: ', publishedVersion, 'version: ', version, '---', entry.fields.title['en-GB']);
        //     if (publishedVersion && ((publishedVersion + 1) === version)) {
        //       // Now unpublish it
        //       console.log('unpublish');
        //       promises.push(entry.unpublish())
        //     } else {
        //       console.log('dont unpublish', entry);
        //       promises.push(entry)
        //     }
        //   })

        //   console.log("promises", Promise.all(promises));
        //   return Promise.all(promises)
        // })
        // .then(entries => {
        //   const promises = [] 

        //   entries.map(entry => {
        //     console.log('DELETE ENTRY', entry);
        //     promises.push(entry.delete())
        //   })

        //   return Promise.all(promises)
        // })
    })
    .then(() => {
      res.status(200).send({ message: 'Entries deleted' })
    })
    .catch(err => {
      res.status(500).send({ error: err })
    });
};
