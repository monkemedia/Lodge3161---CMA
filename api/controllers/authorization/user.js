const contentfulManagement = require('contentful-management')

exports.getUser = async (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })

  try {
    let getCurrentUser = await client.getCurrentUser()

    console.log(getCurrentUser.sys)

    return res.status(200).json({
      userId: getCurrentUser.sys.id
    })
  } catch(err) {
    const error = JSON.parse(err.message)
    return res.status(error.status).send(error)
  }
}
