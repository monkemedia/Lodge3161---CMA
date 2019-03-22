exports.initClient = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ error: 'Need authorization header' });
  }

  const contentfulManagement = require('contentful-management')
  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })

  return client.getSpace(process.env.SPACE)
}
