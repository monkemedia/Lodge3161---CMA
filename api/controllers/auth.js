const axios = require('axios')
const queryString = require('query-string');

exports.getToken = (req, res, next) => {
  const tokenUrl = process.env.TOKEN_URL
  const data = {
    grant_type: process.env.USER_GRANT_TYPE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPE_INT,
    username: req.body.username,
    password: req.body.password
  };

  axios.post(tokenUrl, queryString.stringify(data))
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(err => {
      return res.status(500).send({ error: err.data });
    })
};
