const contentfulManagement = require('contentful-management')

exports.initClient = (req, res) => {
  console.log('monkey');
  if (!req.headers.authorization) {
    return res.status(500).send({ error: 'Need authorization header' });
  }

  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })

  console.log('here');

  return client.getSpace('8vncqxfpqkp5')
}