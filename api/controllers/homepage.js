const contentfulManagement = require('contentful-management')

const lang = 'en-GB'

const publishHandler = (data, publish) => {
  if (publish) {
    return data.publish()
  }
  return data
}

const allPromises = (environment) => {
  const promise = Promise.all([
    environment.getEntry('7tT62M3wjYWqGMqOyAEoC2'),  // Homepage
    environment.getEntry('3qDt3aaDQQMqAu8yg6C4gq'),  // Hero
    environment.getAsset('QB6clFQsSIiCSgmUK6kiS'),   // Hero Image
    environment.getEntry('1soSRd7k9igWCQCs0m6SoY'),  // Content Block 1
    environment.getAsset('d578aNjuTYScCCSc0aaCY'),   // Content Block 1 - Image
    environment.getEntry('75BP94mOSAqkOYOw8Mqcuy'),  // Content Block 1 - Button
    environment.getEntry('23zHiEl1jSqy68Qk04YCMu'),  // Content Block 2
    environment.getAsset('6IFBR4Iz96cOE4w888A0AG'),  // Content Block 2 - Image
    environment.getEntry('2qhPXlN3msa8sMOa0A4aIW'),  // Content Block 2 - Button
    environment.getEntry('U8b4USenKguwO8CcWOQyi'),   // Banner
    environment.getEntry('6egOWOdiDYGu2W6UiWUWGs'),  // Banner Button
    environment.getAsset('55J5C1Ixe0EcKWgYkYqigW'),  // Banner Image
    environment.getEntry('2pV2zP4rZu04YsGyKUao4A'),  // Featured Item 1
    environment.getAsset('6qFiHSYGPYMQSASCg0wWIY'),  // Featured Item 1 - Image
    environment.getEntry('5P6SUHrIDCUI4ym6Qu2OCE'),  // Featured Item 2
    environment.getAsset('tE1JMXvr7Eo28meyU4GK6'),   // Featured Item 2 - Image
    environment.getEntry('1jGDTHj82aYAiq24WY2OeO'),  // Featured Item 3
    environment.getAsset('12k5n7CGnMkGCmcQScuy6W'),  // Featured Item 3 - Image
  ])
  return promise
}

exports.getHomepage = (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })

  client.getSpace('8vncqxfpqkp5')
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment)
    })
    .then(entry => {
      const [
        homepage,
        hero, 
        heroImage, 
        contentBlock1,
        contentBlock1Image,
        contentBlock1Button,
        contentBlock2,
        contentBlock2Image,
        contentBlock2Button,
        banner,
        bannerButton,
        bannerImage,
        featuredItem1,
        featuredItem1Image,
        featuredItem2,
        featuredItem2Image,
        featuredItem3,
        featuredItem3Image,
      ] = entry;

      return res.status(200).json({
        homepage: {
          title: homepage.fields.title[lang],
          slug: homepage.fields.slug[lang],
          description: homepage.fields.description[lang],
          hero: {
            title: hero.fields.title[lang],
            subtitle: hero.fields.subtitle[lang],
            image: {
              title: heroImage.fields.title[lang],
              file: {
                url: heroImage.fields.file[lang].url,
                fileName: heroImage.fields.file[lang].fileName,
                contentType: heroImage.fields.file[lang].contentType
              }
            }
          },
          contentBlock1: {
            title: contentBlock1.fields.title[lang],
            slug: contentBlock1.fields.slug[lang],
            image: {
              title: contentBlock1Image.fields.title[lang],
              file: {
                url: contentBlock1Image.fields.file[lang].url,
                fileName: contentBlock1Image.fields.file[lang].fileName,
                contentType: contentBlock1Image.fields.file[lang].contentType
              }
            },
            button: {
              title: contentBlock1Button.fields.title[lang],
              path: contentBlock1Button.fields.path[lang]
            }
          },
          contentBlock2: {
            title: contentBlock2.fields.title[lang],
            slug: contentBlock2.fields.slug[lang],
            image: {
              title: contentBlock2Image.fields.title[lang],
              file: {
                url: contentBlock2Image.fields.file[lang].url,
                fileName: contentBlock2Image.fields.file[lang].fileName,
                contentType: contentBlock2Image.fields.file[lang].contentType
              }
            },
            button: {
              title: contentBlock2Button.fields.title[lang],
              path: contentBlock2Button.fields.path[lang]
            }
          },
          banner: {
            title: banner.fields.title[lang],
            subtitle: banner.fields.subtitle[lang],
            description: banner.fields.description[lang],
            button: {
              title: bannerButton.fields.title[lang],
              path: bannerButton.fields.path[lang]
            },
            image: {
              title: bannerImage.fields.title[lang],
              file: {
                url: bannerImage.fields.file[lang].url,
                fileName: bannerImage.fields.file[lang].fileName,
                contentType: bannerImage.fields.file[lang].contentType
              }
            }
          },
          featuredItem1: {
            title: featuredItem1.fields.title[lang],
            path: featuredItem1.fields.path[lang],
            image: {
              title: featuredItem1Image.fields.title[lang],
              file: {
                url: featuredItem1Image.fields.file[lang].url,
                fileName: featuredItem1Image.fields.file[lang].fileName,
                contentType: featuredItem1Image.fields.file[lang].contentType
              }
            }
          },
          featuredItem2: {
            title: featuredItem2.fields.title[lang],
            path: featuredItem2.fields.path[lang],
            image: {
              title: featuredItem2Image.fields.title[lang],
              file: {
                url: featuredItem2Image.fields.file[lang].url,
                fileName: featuredItem2Image.fields.file[lang].fileName,
                contentType: featuredItem2Image.fields.file[lang].contentType
              }
            }
          },
          featuredItem3: {
            title: featuredItem3.fields.title[lang],
            path: featuredItem3.fields.path[lang],
            image: {
              title: featuredItem3Image.fields.title[lang],
              file: {
                url: featuredItem3Image.fields.file[lang].url,
                fileName: featuredItem3Image.fields.file[lang].fileName,
                contentType: featuredItem3Image.fields.file[lang].contentType
              }
            }
          }
        }
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};

exports.updateHomepage = (req, res, next) => {
  client.getSpace('8vncqxfpqkp5')
    .then(space => {
      return space.getEnvironment('master')
    })
    .then(environment => {
      return allPromises(environment)
    })
    .then(entry => {
      const [homepage, hero] = entry;
      // Homepage
      homepage.fields.title[lang] = 'Swansea Freemasons'
      //Hero
      hero.fields.title[lang] = 'test 2'

      const promise = Promise.all([
        homepage.update(),
        hero.update()
      ])

      return promise
    })
    .then(data => {
      const [homepage, hero] = data;

      const promise = Promise.all([
        publishHandler(homepage, true),
        publishHandler(hero, true)
      ])

      return promise
    })
    .then(updated => {
      return res.status(200).json({
        message: 'Your work has been saved'
      });
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
};
