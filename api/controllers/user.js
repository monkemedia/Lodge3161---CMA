const contentfulManagement = require('contentful-management')

exports.getUser = (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })

  client.getCurrentUser()
    .then(user => {
      return res.status(200).json(user)
    })
    .catch(err => {
      const error = JSON.parse(err.message)
      return res.status(error.status).send(error)
    })
}
