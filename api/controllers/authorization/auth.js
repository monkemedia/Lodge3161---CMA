const axios = require('axios')
const queryString = require('query-string')

exports.getToken = async (req, res, next) => {
  const tokenUrl = process.env.TOKEN_URL
  const data = {
    grant_type: process.env.USER_GRANT_TYPE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPE_INT,
    username: req.body.username,
    password: req.body.password
  }

  try {
    let getToken = await axios.post(tokenUrl, queryString.stringify(data))
    if (getToken.data.access_token) {
      return res.status(200).json(getToken.data)
    }

    return res.status(500).send({ 
      error: 'Whoops! You\'ve entered an incorrect email address or password. Please check your details and try again' 
    })
  } catch(err) {
    return res.status(500).send({ error: err.data })
  }
}
